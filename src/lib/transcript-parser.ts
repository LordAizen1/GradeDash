import Head from 'next/head';
import { Course, Semester } from '@prisma/client';

export interface ParsedCourse {
    code: string;
    name: string;
    credits: number;
    grade: string;
    type: string;
}

export interface ParsedSemester {
    semesterName: string; // e.g., "Monsoon 2023"
    courses: ParsedCourse[];
}

export function parseTranscript(text: string): ParsedSemester[] {
    const lines = text.split('\n');
    const semesters: ParsedSemester[] = [];
    let currentSemester: ParsedSemester | null = null;

    // Regex Patterns
    // Semester Header: "Semester X - [Type] - [Month] [Year]" or just "Monsoon 2023"
    // Example: "Semester 3 - B.Tech CSE - July 2022" or "Monsoon 2022"
    // We'll look for keywords like "Monsoon", "Winter", "Summer", "Semester" followed by Year
    const semesterRegex = /(Monsoon|Winter|Summer|Semester)\s+(\d{4}|[0-9]+.*(\d{4}))/i;

    // Course Row Pattern
    // Example Raw Text might look like: "1 CSE121 Discrete Mathematics 4 F" 
    // or "1 CSE121 - Discrete Mathematics Mandatory 4 F"
    // We need a robust regex.
    // Core pattern: [Code] [Rest of Name] [Credits] [Grade]
    // Code: [A-Z]{3}[0-9]{3} (e.g., CSE121)
    // Grade: A, A-, B, B-, C, C-, D, F, S, X, W, I (at the end or near end)
    // Credits: Number (1-4 usually)

    // Strategy: Look for the Course Code at the start, and a Grade at the end.
    const courseCodeRegex = /([A-Z]{3}[0-9]{3})\s+(.*)/;

    // Helper to extract grade and credits from the tail of the string
    // This is tricky because "Mandatory (Core) 4 F" -> Credits 4, Grade F

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 1. Detect Semester
        const semMatch = trimmed.match(semesterRegex);
        if (semMatch && (trimmed.includes("Transcript") || trimmed.includes("Grade Report") || trimmed.length < 50)) {
            // It's likely a header.
            if (currentSemester) {
                semesters.push(currentSemester);
            }
            currentSemester = {
                semesterName: trimmed, // Cleanup later
                courses: []
            };
            continue;
        }

        // 2. Detect Course
        // Check if line starts with a serial number? "1." or "1"
        // Let's look for the Course Code anywhere in the line first
        const codeMatch = trimmed.match(/([A-Z]{3}[0-9]{3})/);
        if (codeMatch) {
            if (!currentSemester) {
                // If we found a course but no semester header yet, create a default one or skip?
                // Let's create a "Unknown Semester" if missing, or maybe this is a continuation
                // For now, skip if no semester found, which is risky. Let's make a default.
                currentSemester = { semesterName: "Detected Semester", courses: [] };
            }

            // Parsing Logic
            // Split by spaces is dangerous because of Course Name "Discrete Mathematics"
            // Let's try to identify the end tokens: Grade and Credits

            // Grades: A+, A, A-, B, B-, C, C-, D, F, S, X, W, I
            // Regex for Grade at end of string (or followed by Grade Points)
            // Line ends with: [Credits] [Grade] [Points]?
            // or [Credits] [Grade]

            const gradeRegex = /\b([ABCDF][+-]?|S|X|W|I)\b/;
            const creditRegex = /\b(\d)\b/;

            // Let's assume the standard columns: Serial | Code | Name | Type | Credits | Grade
            // Example row: "1 CSE121 Discrete Mathematics Mandatory 4 F"

            // Extract Code
            const code = codeMatch[1];

            // Remove code and everything before it
            const afterCode = trimmed.substring(trimmed.indexOf(code) + code.length).trim();

            // Now we have: "Discrete Mathematics Mandatory 4 F" (maybe grade points too)
            // Let's split by space and analyze from the back
            const tokens = afterCode.split(/\s+/);

            // Search from back for Grade
            let gradeIndex = -1;
            let grade = "";
            for (let i = tokens.length - 1; i >= 0; i--) {
                if (gradeRegex.test(tokens[i])) {
                    gradeIndex = i;
                    grade = tokens[i];
                    break;
                }
            }

            if (gradeIndex !== -1) {
                // Search for Credits before Grade
                let creditIndex = -1;
                let credits = 0;
                for (let i = gradeIndex - 1; i >= 0; i--) {
                    if (/^[0-9](\.[0-9])?$/.test(tokens[i])) {
                        creditIndex = i;
                        credits = parseFloat(tokens[i]);
                        break;
                    }
                }

                if (creditIndex !== -1) {
                    // Name is everything before Credits (and Type maybe)
                    // "Discrete Mathematics Mandatory"
                    // This is hard to separate Name from Type without a list of Types.
                    // But we can just dump it all in Name for now, or try to strip "Mandatory"

                    const nameTokens = tokens.slice(0, creditIndex);
                    // Clean up common type words if they are at the end of name
                    const typeWords = ["Mandatory", "(Core)", "Open", "Elective", "HSS", "BS", "Engineering", "Science"];

                    const nameEnd = nameTokens.length;
                    // Heuristic: remove known type words from the end
                    // ... simplicity: just join them for name
                    const name = nameTokens.join(" ");

                    // Optional: Extract Type
                    const type = "REGULAR";

                    currentSemester.courses.push({
                        code,
                        name,
                        credits,
                        grade,
                        type
                    });
                }
            }
        }
    }

    if (currentSemester) {
        semesters.push(currentSemester);
    }

    return semesters;
}
