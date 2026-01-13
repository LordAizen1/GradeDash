'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { GRADE_POINTS, calculateSGPA } from "@/lib/gpa-calculations"

import OpenAI from "openai";
import { checkRateLimit } from "@/lib/limits";

export async function uploadTranscript(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" }
    }

    // Check for API Key
    if (!process.env.OPENAI_API_KEY) {
        return { success: false, error: "OpenAI API Key is missing. Please add OPENAI_API_KEY to .env.local" };
    }

    // Guest Restriction
    if (session.user.email === "guest@grade-dash.demo") {
        return { success: false, error: "Guest users cannot upload transcripts. Please sign in with your institute email." };
    }

    // Rate Limit Check
    const limit = await checkRateLimit(session.user.id, 'upload');
    if (!limit.success) {
        return { success: false, error: "Daily upload limit exceeded (5/day). Please try again tomorrow." };
    }

    try {
        const PDFParser = require("pdf2json");
        const openai = new OpenAI();

        // Get the uploaded file
        const file = formData.get('file') as File;
        const isSummer = formData.get('isSummer') === 'on';

        if (!file) {
            return { success: false, error: "No file uploaded" };
        }

        console.log(`Processing file: ${file.name}, type: ${file.type}`);

        // Check File Size (5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            return { success: false, error: "File too large. Maximum size is 5MB." };
        }

        // Read the file as buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Extract text from PDF using pdf2json
        let textContent = "";

        if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
            try {
                const pdfParser = new PDFParser(null, 1); // 1 = text only mode

                // Promisify the event-based library
                textContent = await new Promise<string>((resolve, reject) => {
                    pdfParser.on("pdfParser_dataError", (errData: any) => {
                        reject(new Error(errData.parserError || "PDF parsing failed"));
                    });

                    pdfParser.on("pdfParser_dataReady", () => {
                        // pdf2json returns URL-encoded text, decode it
                        const rawText = pdfParser.getRawTextContent();
                        resolve(rawText);
                    });

                    // Parse the buffer
                    pdfParser.parseBuffer(buffer);
                });

                console.log("Extracted text length:", textContent.length);
            } catch (pdfError) {
                console.error("PDF parsing error:", pdfError);
                return { success: false, error: "Failed to parse PDF. Please ensure the PDF is text-based (not scanned)." };
            }
        } else {
            return { success: false, error: "Please upload a PDF file." };
        }

        if (!textContent || textContent.trim().length < 100) {
            return { success: false, error: "Could not extract text from PDF. It may be a scanned image. Please upload a text-based PDF." };
        }

        // Use Chat Completions API for text parsing
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.1,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a specialized parser for IIIT Delhi academic transcripts. Extract structured course data from the provided text.

OUTPUT FORMAT (strict JSON):
{
    "semesters": [
        {
            "semesterName": "Monsoon 2021",
            "courses": [
                { "code": "CSE101", "name": "Introduction to Programming", "credits": 4, "grade": "A", "type": "Core" }
            ]
        }
    ]
}

CRITICAL EXTRACTION RULES:
1. Course Code: Extract the EXACT code like CSE101, MTH100, ECO223, BTP499, etc. This is REQUIRED.
2. Course Name: Full name of the course
3. Credits: Numeric value (usually 2, 4, or 6)
4. Grade: Single grade like A+, A, A-, B+, B, B-, C+, C, C-, D, F, W, I, S, X
5. Type: One of - "Core", "Elective", "OC" (Online Course), "Thesis", or extract from transcript

SEMESTER DETECTION:
- Look for patterns like "Monsoon 2021", "Winter 2022", "Summer 2023"
- Or "Semester 1", "Semester 2", etc.
- Summer terms should include "Summer" in the name

Return ONLY valid JSON. Include ALL semesters and ALL courses found.`
                },
                {
                    role: "user",
                    content: `Parse this IIIT Delhi transcript and extract all semesters and courses:\n\n${textContent}`
                }
            ]
        });

        let jsonString = response.choices[0]?.message?.content || "";
        console.log("OpenAI Response:", jsonString.substring(0, 500));

        // Clean JSON markdown if present
        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

        // Robust JSON extraction
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        } else {
            console.error("No JSON found in response");
            return { success: false, error: "Failed to parse data from AI response" };
        }

        const parsedData = JSON.parse(jsonString);
        const parsedSemesters = parsedData.semesters;

        if (!parsedSemesters || parsedSemesters.length === 0) {
            return { success: false, error: "Could not detect any semesters in the transcript." }
        }

        let semestersAdded = 0;
        let coursesAdded = 0;

        // Get existing semesters to determine next semester number
        const existingSemesters = await prisma.semester.findMany({
            where: { userId: session!.user!.id }
        });

        let nextSemNum = (existingSemesters.length > 0 ? Math.max(...existingSemesters.map((s: any) => s.semesterNum)) : 0) + 1;

        for (const sem of parsedSemesters) {
            const thisSemNum = nextSemNum;
            let type: "REGULAR" | "SUMMER" = "REGULAR";

            if (isSummer || sem.semesterName?.toLowerCase().includes("summer")) {
                type = "SUMMER";
            }

            // Create Semester
            const newSem = await prisma.semester.create({
                data: {
                    userId: session!.user!.id as string,
                    semesterNum: thisSemNum,
                    type: type
                }
            });

            nextSemNum++;
            semestersAdded++;

            const createdCourses: any[] = [];

            // Add Courses
            for (const course of sem.courses) {
                // Format name as "CODE-Name" for consistent parsing in requirements
                const courseName = course.code
                    ? `${course.code}-${course.name}`
                    : course.name;

                const newCourse = await prisma.course.create({
                    data: {
                        semesterId: newSem.id,
                        name: courseName,
                        code: course.code || null,
                        credits: course.credits || 4,
                        grade: course.grade || "N/A",
                        gradePoints: GRADE_POINTS[course.grade] ?? 0,
                        type: course.type || "Elective"
                    }
                });
                coursesAdded++;
                createdCourses.push(newCourse);
            }

            // Calculate SGPA for this semester
            const sgpa = calculateSGPA(createdCourses);
            await prisma.semester.update({
                where: { id: newSem.id },
                data: { sgpa: sgpa }
            });
        }

        revalidatePath("/semesters")
        revalidatePath("/dashboard")
        revalidatePath("/requirements")
        return { success: true, message: `Successfully imported ${semestersAdded} semesters and ${coursesAdded} courses.` }

    } catch (error) {
        console.error("Transcript upload error:", error)
        return { success: false, error: "Failed to process transcript. " + (error as any).message }
    }
}
