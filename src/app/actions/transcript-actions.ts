'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"


import { GRADE_POINTS, calculateSGPA } from "@/lib/gpa-calculations"

export async function uploadTranscript(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" }
    }

    // Check for API Key
    if (!process.env.OPENAI_API_KEY) {
        return { success: false, error: "OpenAI API Key is missing. Please add OPENAI_API_KEY to .env.local" };
    }

    try {
        const OpenAI = require("openai");
        const openai = new OpenAI();
        const fs = require('fs');
        const path = require('path');
        const os = require('os');

        // 2. Handle Multiple Files
        const rawFiles = formData.getAll('files') as File[];
        const isSummer = formData.get('isSummer') === 'on'; // Checkbox sends 'on' if checked

        // Fallback for previous single file usage (security check)
        if (rawFiles.length === 0) {
            const singleFile = formData.get('file') as File;
            if (singleFile) rawFiles.push(singleFile);
        }

        if (rawFiles.length === 0) {
            return { success: false, error: "No files uploaded" };
        }

        console.log(`Processing ${rawFiles.length} files...`);

        const openAIFileIds: string[] = [];
        const imageContentBlocks: any[] = [];

        // Upload all files to OpenAI
        for (const file of rawFiles) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Determine extension (default to jpg for converted files, or preserve original)
            let extension = "jpg";
            if (file.type === "image/png") extension = "png";

            // Use a unique name for each
            const tempFilePath = path.join(os.tmpdir(), `transcript-part-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`);
            fs.writeFileSync(tempFilePath, buffer);

            const openAIFile = await openai.files.create({
                file: fs.createReadStream(tempFilePath),
                purpose: "vision", // Always use vision now as we convert PDF on client
            });

            openAIFileIds.push(openAIFile.id);
            imageContentBlocks.push({
                type: "image_file",
                image_file: { file_id: openAIFile.id }
            });
        }

        // 3. Create Assistant (Ephemeral)
        const assistant = await openai.beta.assistants.create({
            name: "Transcript Parser",
            instructions: "You are a specialized parser for IIIT Delhi academic transcripts. Your goal is to extract structured JSON data from provided images. You must be extremely precise with Course Codes (e.g. CSE101, MTH100) and Grades.",
            model: "gpt-4o",
            temperature: 0.1, // Low temperature for factual extraction
            tools: [{ type: "code_interpreter" }],
            response_format: { type: "json_object" }
        });

        // 4. Create Thread
        const userMessageContent = [
            {
                type: "text",
                text: `Analyze the provided transcript images. Each image represents a page of the same document.
            
            The transcript is from IIIT Delhi.
            Structure: "Course Code" | "Course Name" | "Credits" | "Grade" | "Type".
            
            GOAL: Extract ALL semesters and courses in the correct chronological order.

            Steps:
            1. Scan through the pages sequentially.
            2. Identify Semester Headers (e.g. "Monsoon 2023", "Semester 1", "Summer Term").
            3. Extract all courses listed under each semester.
            4. Verify Course Codes (e.g. CSE101, ECE111).
            
            CRITICAL RULES:
            - Capture EVERY semester found.
            - If a semester is "Summer", ensure the semesterName includes "Summer".
            - Merge data appearing across page breaks if necessary.
            
            Output JSON matching this schema:
            {
                "semesters": [
                    {
                        "semesterName": "string",
                        "courses": [
                            { "code": "string", "name": "string", "credits": 4, "grade": "string", "type": "string" }
                        ]
                    }
                ]
            }
            
            IMPORTANT: Return ONLY the JSON object.`
            },
            ...imageContentBlocks
        ];

        const thread = await openai.beta.threads.create({
            messages: [
                {
                    role: "user",
                    content: userMessageContent
                }
            ]
        });

        // 5. Run
        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: assistant.id }
        );

        if (run.status !== 'completed') {
            console.error("OpenAI Run failed:", run);
            throw new Error(`OpenAI Run status: ${run.status}`);
        }

        const messages = await openai.beta.threads.messages.list(
            thread.id
        );

        const lastMessage = messages.data[0];
        let jsonString = "";

        if (lastMessage.content[0].type === 'text') {
            jsonString = lastMessage.content[0].text.value;
        }

        console.log("OpenAI Response:", jsonString);

        // Cleanup: Clean JSON markdown if present
        jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

        // Robust JSON extraction
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        } else {
            console.error("No JSON found in response");
            return { success: false, error: "Failed to parse data from AI response: " + jsonString.substring(0, 100) };
        }

        const parsedData = JSON.parse(jsonString);
        const parsedSemesters = parsedData.semesters;

        // Cleanup OpenAI resources (Optional but good practice to delete file)
        // await openai.files.del(openAIFile.id); // Keep for now or delete
        // await openai.beta.assistants.del(assistant.id);

        if (!parsedSemesters || parsedSemesters.length === 0) {
            return { success: false, error: "Could not detect any semesters in the transcript." }
        }

        let semestersAdded = 0;
        let coursesAdded = 0;

        // direct update without transaction to avoid pooler timeouts
        const existingSemesters = await prisma.semester.findMany({
            where: { userId: session!.user!.id }
        });

        let nextSemNum = (existingSemesters.length > 0 ? Math.max(...existingSemesters.map((s: any) => s.semesterNum)) : 0) + 1;

        for (const sem of parsedSemesters) {
            // Try to map semester name to number if possible, else sequential
            let thisSemNum = nextSemNum;
            let type: "REGULAR" | "SUMMER" = "REGULAR";

            if (isSummer || sem.semesterName.toLowerCase().includes("summer")) {
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

            nextSemNum++; // Increment for next loop
            semestersAdded++;

            const createdCourses: any[] = [];

            // Add Courses
            for (const course of sem.courses) {
                const newCourse = await prisma.course.create({
                    data: {
                        semesterId: newSem.id,
                        name: course.name,
                        credits: course.credits,
                        grade: course.grade || "N/A",
                        gradePoints: GRADE_POINTS[course.grade] ?? 0,
                        code: course.code,
                        type: course.type || "REGULAR"
                    }
                });
                coursesAdded++;
                createdCourses.push(newCourse);
            }

            // Calculate and Calculate SGPA for this semester
            const sgpa = calculateSGPA(createdCourses);
            await prisma.semester.update({
                where: { id: newSem.id },
                data: { sgpa: sgpa }
            });
        }

        revalidatePath("/semesters")
        revalidatePath("/dashboard")
        return { success: true, message: `Successfully imported ${semestersAdded} semesters and ${coursesAdded} courses via AI.` }

    } catch (error) {
        console.error("Transcript upload error:", error)
        return { success: false, error: "Failed to process transcript with AI. " + (error as any).message }
    }
}
