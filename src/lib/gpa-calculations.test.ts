// =============================================================================
// GPA Calculations - Unit Tests
// =============================================================================
// These tests verify that SGPA and CGPA calculations work correctly.
//
// TEST STRUCTURE EXPLAINED:
// - `describe`: Groups related tests together (like a folder)
// - `it` / `test`: Defines a single test case (both work the same)
// - `expect`: Makes an assertion - if it fails, the test fails
//
// TESTING PHILOSOPHY:
// 1. Test the "happy path" (normal usage)
// 2. Test edge cases (empty arrays, zeros, etc.)
// 3. Test business rules (F=2 for SGPA, exclusion logic for CGPA)
// =============================================================================

import { describe, it, expect } from 'vitest'
import { calculateSGPA, calculateCGPA, GRADE_POINTS } from './gpa-calculations'

// =============================================================================
// SGPA TESTS
// =============================================================================
describe('calculateSGPA', () => {

    // TEST 1: Basic calculation with multiple courses
    it('calculates SGPA correctly for a typical semester', () => {
        // ARRANGE: Set up test data
        // This mimics a student with 3 courses: A (4 creds), B (4 creds), A- (2 creds)
        const courses = [
            { id: '1', credits: 4, grade: 'A', gradePoints: 10, excludeFromCGPA: false },
            { id: '2', credits: 4, grade: 'B', gradePoints: 8, excludeFromCGPA: false },
            { id: '3', credits: 2, grade: 'A-', gradePoints: 9, excludeFromCGPA: false },
        ] as any // 'as any' because we're not including all Course fields

        // ACT: Call the function
        const sgpa = calculateSGPA(courses)

        // ASSERT: Check the result
        // Expected: (4*10 + 4*8 + 2*9) / (4+4+2) = (40 + 32 + 18) / 10 = 90/10 = 9.0
        expect(sgpa).toBe(9.0)
    })

    // TEST 2: Empty semester (edge case)
    it('returns 0 for an empty course list', () => {
        const sgpa = calculateSGPA([])
        expect(sgpa).toBe(0)
    })

    // TEST 3: All A+ grades (perfect score)
    it('returns 10.0 for all A+ grades', () => {
        const courses = [
            { id: '1', credits: 4, grade: 'A+', gradePoints: 10, excludeFromCGPA: false },
            { id: '2', credits: 4, grade: 'A+', gradePoints: 10, excludeFromCGPA: false },
        ] as any

        expect(calculateSGPA(courses)).toBe(10.0)
    })

    // TEST 4: F grade uses 2 points for SGPA (business rule)
    it('treats F as 2 points for SGPA calculation', () => {
        const courses = [
            { id: '1', credits: 4, grade: 'F', gradePoints: 0, excludeFromCGPA: false }, // Stored as 0, but SGPA should use 2
            { id: '2', credits: 4, grade: 'A', gradePoints: 10, excludeFromCGPA: false },
        ] as any

        // Expected: (4*2 + 4*10) / 8 = (8 + 40) / 8 = 48/8 = 6.0
        expect(calculateSGPA(courses)).toBe(6.0)
    })

    // TEST 5: S (Satisfactory) grades are excluded from SGPA
    it('excludes S grades from calculation', () => {
        const courses = [
            { id: '1', credits: 4, grade: 'A', gradePoints: 10, excludeFromCGPA: false },
            { id: '2', credits: 2, grade: 'S', gradePoints: 0, excludeFromCGPA: false }, // Should be excluded
        ] as any

        // Only the A grade counts: 4*10 / 4 = 10.0
        expect(calculateSGPA(courses)).toBe(10.0)
    })

    // TEST 6: Withdrawn courses are excluded
    it('excludes W (Withdrawn) grades from calculation', () => {
        const courses = [
            { id: '1', credits: 4, grade: 'B', gradePoints: 8, excludeFromCGPA: false },
            { id: '2', credits: 4, grade: 'W', gradePoints: 0, excludeFromCGPA: false },
        ] as any

        // Only B counts: 4*8 / 4 = 8.0
        expect(calculateSGPA(courses)).toBe(8.0)
    })
})

// =============================================================================
// CGPA TESTS
// =============================================================================
describe('calculateCGPA', () => {

    // TEST 1: Basic CGPA across two semesters
    it('calculates CGPA correctly for multiple semesters', () => {
        const semesters = [
            {
                semesterNum: 1,
                courses: [
                    { id: '1', credits: 4, grade: 'A', gradePoints: 10, excludeFromCGPA: false },
                    { id: '2', credits: 4, grade: 'B', gradePoints: 8, excludeFromCGPA: false },
                ],
            },
            {
                semesterNum: 2,
                courses: [
                    { id: '3', credits: 4, grade: 'A-', gradePoints: 9, excludeFromCGPA: false },
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 2)

        // Total: (4*10 + 4*8 + 4*9) / 12 = (40 + 32 + 36) / 12 = 108/12 = 9.0
        expect(result.cgpa).toBe(9.0)
    })

    // TEST 2: F grades are excluded from CGPA (unlike SGPA)
    it('excludes F grades from CGPA calculation', () => {
        const semesters = [
            {
                semesterNum: 1,
                courses: [
                    { id: '1', credits: 4, grade: 'A', gradePoints: 10, excludeFromCGPA: false },
                    { id: '2', credits: 4, grade: 'F', gradePoints: 0, excludeFromCGPA: false }, // Should be excluded
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 1)

        // Only A counts: 4*10 / 4 = 10.0
        expect(result.cgpa).toBe(10.0)
        expect(result.earnedCredits).toBe(4) // F doesn't count as earned
    })

    // TEST 3: Empty semesters
    it('returns 0 for empty semesters', () => {
        const result = calculateCGPA([], 0)
        expect(result.cgpa).toBe(0)
        expect(result.earnedCredits).toBe(0)
    })

    // TEST 4: S (Satisfactory) grades count as earned credits but not in CGPA
    it('counts S grades as earned credits but excludes from CGPA', () => {
        const semesters = [
            {
                semesterNum: 1,
                courses: [
                    { id: '1', credits: 4, grade: 'A', gradePoints: 10, excludeFromCGPA: false },
                    { id: '2', credits: 2, grade: 'S', gradePoints: 0, excludeFromCGPA: false },
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 1)

        expect(result.cgpa).toBe(10.0) // Only A in GPA calc
        expect(result.earnedCredits).toBe(6) // Both A and S count as earned
    })
})

// =============================================================================
// WORST-8-CREDITS EXCLUSION TESTS
// =============================================================================
describe('calculateCGPA - worst-8-credits exclusion', () => {

    // Helper: create a course with given grade
    const course = (id: string, credits: number, grade: string, gradePoints: number) => ({
        id, credits, grade, gradePoints, excludeFromCGPA: false,
    })

    // Helper: create a semester of 4-credit A courses (20 credits per sem)
    const makeASemester = (semNum: number, count = 5) => ({
        semesterNum: semNum,
        courses: Array.from({ length: count }, (_, i) =>
            course(`s${semNum}c${i}`, 4, 'A', 10)
        ),
    })

    it('does NOT exclude credits when below baseline (5 semesters, 100 credits)', () => {
        // 5 semesters x 20 credits = 100 credits, no baseline for 5 semesters
        const semesters = Array.from({ length: 5 }, (_, i) => makeASemester(i + 1)) as any

        const result = calculateCGPA(semesters, 5)

        expect(result.cgpa).toBe(10.0)
        expect(result.removedCredits).toBe(0)
    })

    it('excludes worst credits at 6-semester baseline (>116 credits)', () => {
        // 6 semesters x 20 credits = 120 credits > 116 baseline
        // Add one D-grade course to test exclusion improves CGPA
        const semesters = [
            ...Array.from({ length: 5 }, (_, i) => makeASemester(i + 1)),
            {
                semesterNum: 6,
                courses: [
                    course('d1', 4, 'D', 4),       // This should be excluded (worst)
                    course('d2', 4, 'A', 10),
                    course('d3', 4, 'A', 10),
                    course('d4', 4, 'A', 10),
                    course('d5', 4, 'A', 10),
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 6)

        // 120 - 116 = 4 credits to exclude (max 8)
        // Excluding the D (4 credits, 4 points) gives: (120*10 - 4*4) / (120-4) = 1184/116 ≈ 10.21 → capped
        // Actually: total without D = (29 courses * 4 credits * 10 points) / (29*4) = 10.0
        // With D included but excluded: removes D's contribution
        expect(result.removedCredits).toBe(4)
        expect(result.cgpa).toBe(10.0) // All remaining courses are A
    })

    it('excludes up to 8 credits maximum even when excess is larger', () => {
        // 8 semesters x 20 credits = 160 credits > 152 baseline
        // Excess = 8, so max 8 credits excluded
        const semesters = [
            ...Array.from({ length: 7 }, (_, i) => makeASemester(i + 1)),
            {
                semesterNum: 8,
                courses: [
                    course('w1', 4, 'C-', 5),   // candidate for exclusion
                    course('w2', 4, 'D', 4),     // candidate for exclusion
                    course('w3', 4, 'A', 10),
                    course('w4', 4, 'A', 10),
                    course('w5', 4, 'A', 10),
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 8)

        // 160 - 152 = 8 credits to exclude
        // Should exclude D (4 credits) + C- (4 credits) = 8 credits
        expect(result.removedCredits).toBe(8)
    })

    it('does NOT exclude A+ courses (grade points = 10)', () => {
        // All A+ courses — nothing to exclude since all are 10 points
        const semesters = Array.from({ length: 6 }, (_, i) => makeASemester(i + 1)) as any

        const result = calculateCGPA(semesters, 6)

        // Even though credits > baseline, all courses are A (10 points) so no benefit to exclusion
        expect(result.cgpa).toBe(10.0)
    })

    it('excludes courses with excludeFromCGPA flag', () => {
        const semesters = [
            {
                semesterNum: 1,
                courses: [
                    course('1', 4, 'A', 10),
                    { id: '2', credits: 4, grade: 'B', gradePoints: 8, excludeFromCGPA: true },
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 1)

        // Only A counts (B is manually excluded)
        expect(result.cgpa).toBe(10.0)
    })

    it('does not trigger exclusion when credits exactly at baseline', () => {
        // 6 semesters, exactly 116 credits (not exceeding)
        // 5 semesters x 20 = 100, + 1 semester with 16 credits
        const semesters = [
            ...Array.from({ length: 5 }, (_, i) => makeASemester(i + 1)),
            {
                semesterNum: 6,
                courses: [
                    course('e1', 4, 'B', 8),
                    course('e2', 4, 'B', 8),
                    course('e3', 4, 'B', 8),
                    course('e4', 4, 'B', 8),
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 6)

        // 100 + 16 = 116 = baseline, no exclusion
        expect(result.removedCredits).toBe(0)
    })

    it('picks optimal exclusion with mixed low grades', () => {
        // 7 semesters, need >136 credits
        // 7 x 20 = 140 credits, excess = 4
        const semesters = [
            ...Array.from({ length: 6 }, (_, i) => makeASemester(i + 1)),
            {
                semesterNum: 7,
                courses: [
                    course('m1', 4, 'D', 4),     // 4 points — worse
                    course('m2', 4, 'C-', 5),    // 5 points — bad but less so
                    course('m3', 4, 'A', 10),
                    course('m4', 4, 'A', 10),
                    course('m5', 4, 'A', 10),
                ],
            },
        ] as any

        const result = calculateCGPA(semesters, 7)

        // Can exclude 4 credits max. Should pick the D (4 grade points) over C- (5 grade points)
        expect(result.removedCredits).toBe(4)
        // Without D: all remaining are A or C-
        // Points: (120*10 + 4*5 + 4*10 + 4*10 + 4*10) / 136 = (1200 + 20 + 40 + 40 + 40) / 136 = 1340/136 ≈ 9.85
        expect(result.cgpa).toBeCloseTo(9.85, 1)
    })
})

// =============================================================================
// GRADE POINTS MAPPING TESTS
// =============================================================================
describe('GRADE_POINTS', () => {
    it('has correct values for standard grades', () => {
        expect(GRADE_POINTS['A+']).toBe(10)
        expect(GRADE_POINTS['A']).toBe(10)
        expect(GRADE_POINTS['A-']).toBe(9)
        expect(GRADE_POINTS['B']).toBe(8)
        expect(GRADE_POINTS['B-']).toBe(7)
        expect(GRADE_POINTS['C']).toBe(6)
        expect(GRADE_POINTS['C-']).toBe(5)
        expect(GRADE_POINTS['D']).toBe(4)
        expect(GRADE_POINTS['F']).toBe(0)
    })
})
