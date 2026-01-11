import { Course, Semester } from "@prisma/client";

// Grade Points Mapping
export const GRADE_POINTS: Record<string, number> = {
    "A+": 10,
    A: 10,
    "A-": 9,
    B: 8,
    "B-": 7,
    C: 6,
    "C-": 5,
    D: 4,
    F: 0, // 0 for CGPA, 2 for SGPA (handled in SGPA calc)
    S: 0,
    X: 0,
    W: 0,
    I: 0,
    "N/A": 0, // Unreleased results - excluded from calculations
};

// SGPA Calculation
export function calculateSGPA(courses: Course[]): number {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
        // Skip non-graded courses: S (Satisfactory), X (Exempted), W (Withdrawn), I (Incomplete), N/A (Unreleased)
        if (["S", "X", "W", "I", "N/A"].includes(course.grade)) continue;

        let points = course.gradePoints;
        // Specific rule: F is 2 points for SGPA if the regulations say so, 
        // but the prompt says: "F: 2 (for SGPA), 0 (for CGPA)". 
        // The Course model has `gradePoints` stored. 
        // Usually we trust the stored `gradePoints` (which should be 2 for F if that's the input), 
        // but let's enforce the F=2 rule here if grade is F.
        if (course.grade === "F") {
            points = 2;
        }

        totalPoints += course.credits * points;
        totalCredits += course.credits;
    }

    if (totalCredits === 0) return 0;
    return parseFloat((totalPoints / totalCredits).toFixed(2));
}

// Baseline credits for worst-grade exclusion
const BASELINES = {
    6: 116,
    7: 136,
    8: 152, // Sem 8+
};

// Simplified Course interface for calculation if full Model isn't needed
type CalcCourse = Pick<Course, "id" | "credits" | "grade" | "gradePoints" | "excludeFromCGPA">;
type CalcSemester = Pick<Semester, "semesterNum"> & { courses: CalcCourse[] };

export function calculateCGPA(semesters: CalcSemester[], completedSemestersCount: number): { cgpa: number; calculateCgpaCredits: number; earnedCredits: number; removedCredits: number } {
    // Aggregate courses
    let cgpaCourses: CalcCourse[] = [];
    let earnedCredits = 0;

    semesters.forEach(sem => {
        sem.courses.forEach(c => {
            // Earned Credits Logic: Include everything except F, W, I, X, N/A
            // Assuming S counts as earned.
            // Check if grade indicates completion
            const isEarned = !["F", "W", "I", "X", "N/A"].includes(c.grade);
            if (isEarned) {
                earnedCredits += c.credits;
            }

            // CGPA Credits Logic:
            // Filter out S, X, W, I, N/A (unreleased) and those manually excluded
            if (["S", "X", "W", "I", "N/A"].includes(c.grade)) return;
            // Exclude F from CGPA denominator/calculation (Failed courses don't count until cleared)
            if (c.grade === "F") return;
            if (c.excludeFromCGPA) return;

            cgpaCourses.push(c);
        });
    });

    // Calculate Total Credits and Points for CGPA
    let totalCgpaCredits = cgpaCourses.reduce((sum, c) => sum + c.credits, 0);

    // Exclusion Logic (Worst 8 credits) applies to CGPA calculation
    let baseline = 0;
    if (completedSemestersCount >= 8) baseline = BASELINES[8];
    else if (completedSemestersCount === 7) baseline = BASELINES[7];
    else if (completedSemestersCount === 6) baseline = BASELINES[6];

    let nToExclude = 0;
    if (baseline > 0 && totalCgpaCredits > baseline) {
        nToExclude = Math.min(totalCgpaCredits - baseline, 8);
    }

    // If nothing to exclude, return standard CGPA
    if (nToExclude <= 0) {
        const totalPoints = cgpaCourses.reduce((sum, c) => sum + (c.credits * (c.grade === "F" ? 0 : c.gradePoints)), 0);
        return {
            cgpa: totalCgpaCredits > 0 ? parseFloat((totalPoints / totalCgpaCredits).toFixed(2)) : 0,
            calculateCgpaCredits: totalCgpaCredits, // For debugging/display if needed
            earnedCredits, // The actual credits towards degree
            removedCredits: 0
        };
    }

    // Optimization Logic (same as before but using cgpaCourses)
    let maxCGPA = 0;
    const initialTotalPoints = cgpaCourses.reduce((sum, c) => sum + (c.credits * (c.grade === "F" ? 0 : c.gradePoints)), 0);

    // Filter candidates for exclusion (only those that hurt the average, grade < 10)
    const candidates = cgpaCourses.filter(c => (c.grade === "F" ? 0 : c.gradePoints) < 10).sort((a, b) => (a.grade === "F" ? 0 : a.gradePoints) - (b.grade === "F" ? 0 : b.gradePoints));

    maxCGPA = totalCgpaCredits > 0 ? initialTotalPoints / totalCgpaCredits : 0;

    function findMax(idx: number, removedCreds: number, removedPoints: number) {
        const currCreds = totalCgpaCredits - removedCreds;
        const currPoints = initialTotalPoints - removedPoints;
        if (currCreds > 0) {
            const val = currPoints / currCreds;
            if (val > maxCGPA) maxCGPA = val;
        }

        for (let i = idx; i < candidates.length; i++) {
            const c = candidates[i];
            if (removedCreds + c.credits <= nToExclude) {
                findMax(i + 1, removedCreds + c.credits, removedPoints + (c.credits * (c.grade === "F" ? 0 : c.gradePoints)));
            }
        }
    }

    findMax(0, 0, 0);

    return {
        cgpa: parseFloat(maxCGPA.toFixed(2)),
        calculateCgpaCredits: totalCgpaCredits,
        earnedCredits,
        removedCredits: nToExclude
    };
}
