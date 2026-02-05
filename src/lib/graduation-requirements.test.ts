import { describe, it, expect } from 'vitest'
import {
    isSSHCourse,
    isCSEElective,
    isSGCourse,
    isCWCourse,
    isOnlineCourse,
    isBTPCourse,
    isIndependentWork,
    isCompleted,
    calculateRequirementsProgress,
    getRequirementsConstants,
    CSE_REQUIREMENTS,
} from './graduation-requirements'

// Helper to create a course object for testing
function makeCourse(overrides: Partial<{
    code: string | null
    name: string | null
    credits: number
    grade: string
    type: string
    excludeFromCGPA: boolean
}> = {}) {
    return {
        code: overrides.code ?? null,
        name: overrides.name ?? null,
        credits: overrides.credits ?? 4,
        grade: overrides.grade ?? 'A',
        type: overrides.type ?? 'Elective',
        excludeFromCGPA: overrides.excludeFromCGPA ?? false,
    }
}

// =============================================================================
// COURSE CLASSIFICATION TESTS
// =============================================================================
describe('isCompleted', () => {
    it('returns true for passing grades', () => {
        expect(isCompleted(makeCourse({ grade: 'A' }))).toBe(true)
        expect(isCompleted(makeCourse({ grade: 'B-' }))).toBe(true)
        expect(isCompleted(makeCourse({ grade: 'D' }))).toBe(true)
        expect(isCompleted(makeCourse({ grade: 'S' }))).toBe(true)
    })

    it('returns false for failing/incomplete grades', () => {
        expect(isCompleted(makeCourse({ grade: 'F' }))).toBe(false)
        expect(isCompleted(makeCourse({ grade: 'W' }))).toBe(false)
        expect(isCompleted(makeCourse({ grade: 'I' }))).toBe(false)
        expect(isCompleted(makeCourse({ grade: 'X' }))).toBe(false)
        expect(isCompleted(makeCourse({ grade: 'N/A' }))).toBe(false)
        expect(isCompleted(makeCourse({ grade: 'WITHDRAWN' }))).toBe(false)
    })

    it('handles case insensitivity and whitespace', () => {
        expect(isCompleted(makeCourse({ grade: ' f ' }))).toBe(false)
        expect(isCompleted(makeCourse({ grade: 'w' }))).toBe(false)
    })
})

describe('isSSHCourse', () => {
    it('identifies SSH courses by code prefix', () => {
        expect(isSSHCourse(makeCourse({ code: 'SSH201', type: 'Elective' }))).toBe(true)
        expect(isSSHCourse(makeCourse({ code: 'SOC301', type: 'Elective' }))).toBe(true)
        expect(isSSHCourse(makeCourse({ code: 'ECO223', type: 'Elective' }))).toBe(true)
        expect(isSSHCourse(makeCourse({ code: 'PSY101', type: 'Elective' }))).toBe(true)
    })

    it('identifies SSH courses by type field', () => {
        expect(isSSHCourse(makeCourse({ code: 'ABC100', type: 'SSH' }))).toBe(true)
    })

    it('rejects non-SSH courses', () => {
        expect(isSSHCourse(makeCourse({ code: 'CSE301', type: 'Elective' }))).toBe(false)
        expect(isSSHCourse(makeCourse({ code: 'MTH301', type: 'Elective' }))).toBe(false)
    })

    it('rejects core courses even with SSH prefix', () => {
        expect(isSSHCourse(makeCourse({ code: 'SSH101', type: 'Core' }))).toBe(false)
    })
})

describe('isCSEElective', () => {
    it('identifies CSE electives (3xx+ level, non-core)', () => {
        expect(isCSEElective(makeCourse({ code: 'CSE301', type: 'Elective' }))).toBe(true)
        expect(isCSEElective(makeCourse({ code: 'CSE556', type: 'Department Elective' }))).toBe(true)
    })

    it('rejects CSE courses below 300 level', () => {
        expect(isCSEElective(makeCourse({ code: 'CSE101', type: 'Elective' }))).toBe(false)
        expect(isCSEElective(makeCourse({ code: 'CSE201', type: 'Elective' }))).toBe(false)
    })

    it('rejects core CSE courses', () => {
        expect(isCSEElective(makeCourse({ code: 'CSE301', type: 'Core' }))).toBe(false)
    })

    it('rejects non-CSE prefix courses', () => {
        expect(isCSEElective(makeCourse({ code: 'ECE301', type: 'Elective' }))).toBe(false)
    })
})

describe('isOnlineCourse', () => {
    it('identifies online courses by CSE999/998 codes', () => {
        expect(isOnlineCourse(makeCourse({ code: 'CSE999' }))).toBe(true)
        expect(isOnlineCourse(makeCourse({ code: 'CSE998' }))).toBe(true)
    })

    it('identifies online courses by type', () => {
        expect(isOnlineCourse(makeCourse({ code: 'ABC100', type: 'OC' }))).toBe(true)
        expect(isOnlineCourse(makeCourse({ code: 'ABC100', type: 'Online Course' }))).toBe(true)
    })

    it('rejects regular courses', () => {
        expect(isOnlineCourse(makeCourse({ code: 'CSE301', type: 'Elective' }))).toBe(false)
    })
})

describe('isBTPCourse', () => {
    it('identifies BTP by code prefix', () => {
        expect(isBTPCourse(makeCourse({ code: 'BTP499', credits: 4 }))).toBe(true)
    })

    it('rejects courses with less than 3 credits when using type fallback', () => {
        expect(isBTPCourse(makeCourse({ code: 'XYZ100', type: 'Thesis', credits: 2 }))).toBe(false)
    })

    it('rejects MSC community work courses', () => {
        expect(isBTPCourse(makeCourse({ code: 'MSC491', name: 'MSC491-Community Work', type: 'Thesis', credits: 4 }))).toBe(false)
    })
})

describe('isSGCourse', () => {
    it('identifies SG courses', () => {
        expect(isSGCourse(makeCourse({ code: 'SG101', type: 'SG' }))).toBe(true)
        expect(isSGCourse(makeCourse({ name: 'Self Growth Activity', type: 'Self Growth' }))).toBe(true)
    })
})

describe('isCWCourse', () => {
    it('identifies CW courses', () => {
        expect(isCWCourse(makeCourse({ code: 'CW101', type: 'CW' }))).toBe(true)
        expect(isCWCourse(makeCourse({ name: 'MSC491-Community Work' }))).toBe(true)
    })
})

describe('isIndependentWork', () => {
    it('identifies IP/IS/UR prefix courses', () => {
        expect(isIndependentWork(makeCourse({ code: 'IP301' }))).toBe(true)
        expect(isIndependentWork(makeCourse({ code: 'IS201' }))).toBe(true)
        expect(isIndependentWork(makeCourse({ code: 'UR301' }))).toBe(true)
        expect(isIndependentWork(makeCourse({ code: 'BIP398' }))).toBe(true)
    })

    it('rejects regular courses', () => {
        expect(isIndependentWork(makeCourse({ code: 'CSE301' }))).toBe(false)
    })
})

// =============================================================================
// REQUIREMENTS CONSTANTS TESTS
// =============================================================================
describe('getRequirementsConstants', () => {
    it('returns CSE requirements by default', () => {
        expect(getRequirementsConstants()).toBe(CSE_REQUIREMENTS)
        expect(getRequirementsConstants('CSE')).toBe(CSE_REQUIREMENTS)
    })

    it('returns branch-specific requirements', () => {
        const csam = getRequirementsConstants('CSAM')
        expect(csam.totalCredits).toBe(156)
        expect((csam as any).disciplineTotal).toBe(32)
    })
})

// =============================================================================
// CSE BRANCH PROGRESS CALCULATION TESTS
// =============================================================================
describe('calculateRequirementsProgress (CSE)', () => {

    it('calculates basic progress with mixed course types', () => {
        const courses = [
            // Core courses (40 credits)
            ...Array.from({ length: 10 }, (_, i) =>
                makeCourse({ code: `CSE${100 + i}`, credits: 4, grade: 'A', type: 'Core' })
            ),
            // CSE Electives (16 credits)
            ...Array.from({ length: 4 }, (_, i) =>
                makeCourse({ code: `CSE${301 + i}`, credits: 4, grade: 'B', type: 'Elective' })
            ),
            // SSH (8 credits)
            makeCourse({ code: 'SSH201', credits: 4, grade: 'A', type: 'SSH' }),
            makeCourse({ code: 'SOC301', credits: 4, grade: 'B', type: 'SSH' }),
            // SG + CW
            makeCourse({ code: 'SG101', credits: 2, grade: 'S', type: 'SG' }),
            makeCourse({ code: 'CW101', credits: 2, grade: 'S', type: 'CW' }),
        ]

        const progress = calculateRequirementsProgress(courses, 8.0, 'CSE')

        // Total: 40 + 16 + 8 + 2 + 2 = 68 credits
        expect(progress.total.earned).toBe(68)
        expect(progress.total.required).toBe(156)
        expect(progress.cseElectives?.earned).toBe(16)
        expect(progress.cseElectives?.required).toBe(32)
        expect(progress.ssh.earned).toBe(8)
        expect(progress.ssh.required).toBe(12)
        expect(progress.sg.earned).toBe(2)
        expect(progress.sg.completed).toBe(true)
        expect(progress.cw.earned).toBe(2)
        expect(progress.cw.completed).toBe(true)
    })

    it('caps online credits at 8', () => {
        const courses = [
            // 12 credits of online courses (should be capped to 8)
            makeCourse({ code: 'CSE999', credits: 4, grade: 'A', type: 'OC' }),
            makeCourse({ code: 'CSE999', credits: 4, grade: 'A', type: 'OC' }),
            makeCourse({ code: 'CSE999', credits: 4, grade: 'A', type: 'OC' }),
        ]

        const progress = calculateRequirementsProgress(courses, 8.0, 'CSE')

        expect(progress.online.earned).toBe(12)     // raw total
        expect(progress.online.max).toBe(8)
        expect(progress.online.withinLimit).toBe(false)
        expect(progress.total.earned).toBe(8)        // capped in total
    })

    it('caps independent work credits at 8', () => {
        const courses = [
            makeCourse({ code: 'IP301', credits: 4, grade: 'A', type: 'IP/IS/UR' }),
            makeCourse({ code: 'IS201', credits: 4, grade: 'A', type: 'IP/IS/UR' }),
            makeCourse({ code: 'UR301', credits: 4, grade: 'B', type: 'IP/IS/UR' }),
        ]

        const progress = calculateRequirementsProgress(courses, 8.0, 'CSE')

        expect(progress.independentWork.earned).toBe(12)
        expect(progress.independentWork.withinLimit).toBe(false)
        expect(progress.total.earned).toBe(8) // capped
    })

    it('excludes failed courses from progress', () => {
        const courses = [
            makeCourse({ code: 'CSE301', credits: 4, grade: 'A', type: 'Elective' }),
            makeCourse({ code: 'CSE302', credits: 4, grade: 'F', type: 'Elective' }), // Failed
        ]

        const progress = calculateRequirementsProgress(courses, 8.0, 'CSE')

        expect(progress.cseElectives?.earned).toBe(4) // Only passed course
    })

    it('calculates honors eligibility correctly', () => {
        // Need: 168 credits, BTP, CGPA >= 8.0
        const courses = [
            // 160 credits of core
            ...Array.from({ length: 40 }, (_, i) =>
                makeCourse({ code: `CSE${100 + i}`, credits: 4, grade: 'A', type: 'Core' })
            ),
            // BTP (8 credits)
            makeCourse({ code: 'BTP499', credits: 4, grade: 'A', type: 'Thesis' }),
            makeCourse({ code: 'BTP498', credits: 4, grade: 'A', type: 'Thesis' }),
        ]

        const eligible = calculateRequirementsProgress(courses, 9.0, 'CSE')
        expect(eligible.honors.hasEnoughCredits).toBe(true)
        expect(eligible.honors.hasBTP).toBe(true)
        expect(eligible.honors.hasCgpa).toBe(true)
        expect(eligible.honors.eligible).toBe(true)

        // Same courses but low CGPA
        const notEligible = calculateRequirementsProgress(courses, 7.5, 'CSE')
        expect(notEligible.honors.hasCgpa).toBe(false)
        expect(notEligible.honors.eligible).toBe(false)
    })

    it('marks honors ineligible without BTP', () => {
        const courses = Array.from({ length: 42 }, (_, i) =>
            makeCourse({ code: `CSE${100 + i}`, credits: 4, grade: 'A', type: 'Core' })
        ) // 168 credits, no BTP

        const progress = calculateRequirementsProgress(courses, 9.0, 'CSE')

        expect(progress.honors.hasEnoughCredits).toBe(true)
        expect(progress.honors.hasBTP).toBe(false)
        expect(progress.honors.eligible).toBe(false)
    })
})
