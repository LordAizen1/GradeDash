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
