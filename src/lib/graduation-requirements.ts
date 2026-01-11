/**
 * Graduation Requirements Logic for IIIT Delhi B.Tech Programs
 * Currently supports: CSE
 * 
 * NOTE: Course codes are extracted from the name field if the code field is empty.
 * Format expected: "CSE301-Course Name" or "CSE301 - Course Name"
 */

// SSH Course Code Prefixes
const SSH_PREFIXES = ['SSH', 'SOC', 'ECO', 'PSY', 'PHI', 'ENT', 'COM'];

// CSE Course Code Prefixes (for 32-credit elective requirement)
const CSE_PREFIXES = ['CSE'];

// New Branch Prefixes
const MTH_PREFIXES = ['MTH', 'MATH'];
const ECE_PREFIXES = ['ECE', 'ELD', 'DES'];
const BIO_PREFIXES = ['BIO'];
const DES_PREFIXES = ['DES', 'HCI']; // CSD
const CSAI_PREFIXES = ['CSE', 'CSB', 'CSD', 'CSZ', 'AI']; // CSAI
const EVE_PREFIXES = ['EVE']; // EVE (Reg 3.6), cross-listed ECE/CSE may apply if coded as EVE

// ============================================================
// CSE B.Tech Requirements
// ============================================================
export const CSE_REQUIREMENTS = {
    totalCredits: 156,
    cseElectiveCredits: 32,      // 3xx+ level, non-core, excludes BTP/IP
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,    // IP/IS/UR combined max
    btp: {
        min: 8,
        max: 12,
        maxPerSemester: 8
    },
    honors: {
        totalCredits: 168,         // 12 extra discipline credits
        minCgpa: 8.0,
        requiresBtp: true
    }
};

// ============================================================
// CSSS B.Tech Requirements (2019+ Batch)
// ============================================================
export const CSSS_REQUIREMENTS = {
    totalCredits: 156,
    cseElectiveCredits: 16,      // Reduced from 32 for CSSS
    sshCredits: 28,              // Increased from 12 (Discipline Electives)
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: {
        min: 8,
        max: 12,
        maxPerSemester: 8
    },
    honors: {
        totalCredits: 168,
        minCgpa: 8.0,
        requiresBtp: true
    }

};

// ============================================================
// CSAM B.Tech Requirements
// ============================================================
export const CSAM_REQUIREMENTS = {
    totalCredits: 156,
    disciplineTotal: 32,
    minCseCredits: 12,
    minMathCredits: 12,
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: { min: 8, max: 12, maxPerSemester: 8 },
    honors: { totalCredits: 168, minCgpa: 8.0, requiresBtp: true }
};

// ============================================================
// ECE B.Tech Requirements
// ============================================================
export const ECE_REQUIREMENTS = {
    totalCredits: 156,
    eceElectiveCredits: 32,
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: { min: 8, max: 12, maxPerSemester: 8 },
    honors: { totalCredits: 168, minCgpa: 8.0, requiresBtp: true }
};

// ============================================================
// CSB B.Tech Requirements
// ============================================================
export const CSB_REQUIREMENTS = {
    totalCredits: 156,
    disciplineTotal: 32,
    minCseCredits: 12,
    minBioCredits: 12,
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: { min: 8, max: 12, maxPerSemester: 8 },
    honors: { totalCredits: 168, minCgpa: 8.0, requiresBtp: true }
};

// ============================================================
// CSD B.Tech Requirements
// ============================================================
export const CSD_REQUIREMENTS = {
    totalCredits: 156,
    disciplineTotal: 32,
    minCseCredits: 12,
    minDesCredits: 12,
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: { min: 8, max: 12, maxPerSemester: 8 },
    honors: { totalCredits: 168, minCgpa: 8.0, requiresBtp: true }
};

// ============================================================
// CSAI B.Tech Requirements
// ============================================================
export const CSAI_REQUIREMENTS = {
    totalCredits: 156,
    csaiElectiveCredits: 32,
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: { min: 8, max: 12, maxPerSemester: 8 },
    honors: { totalCredits: 168, minCgpa: 8.0, requiresBtp: true }
};

// ============================================================
// EVE B.Tech Requirements
// ============================================================
export const EVE_REQUIREMENTS = {
    totalCredits: 156,
    eveElectiveCredits: 16,
    sshCredits: 12,
    sgCredits: 2,
    cwCredits: 2,
    maxOnlineCredits: 8,
    maxIndependentCredits: 8,
    btp: { min: 8, max: 12, maxPerSemester: 8 },
    honors: { totalCredits: 168, minCgpa: 8.0, requiresBtp: true }
};

export function getRequirementsConstants(branch: string = 'CSE') {
    switch (branch) {
        case 'CSSS': return CSSS_REQUIREMENTS;
        case 'CSAM': return CSAM_REQUIREMENTS;
        case 'ECE': return ECE_REQUIREMENTS;
        case 'CSB': return CSB_REQUIREMENTS;
        case 'CSD': return CSD_REQUIREMENTS;
        case 'CSAI': return CSAI_REQUIREMENTS;
        case 'EVE': return EVE_REQUIREMENTS;
        default: return CSE_REQUIREMENTS;
    }
}

// ============================================================
// Helper Functions
// ============================================================

interface CourseForRequirements {
    code?: string | null;
    name?: string | null;
    credits: number;
    grade: string;
    type: string;
    excludeFromCGPA: boolean;
}

/**
 * Extract course code from name field if code is not available
 * Handles formats like: "CSE301-Course Name" or "  CSE 301 - Course Name"
 */
function getCourseCode(course: CourseForRequirements): string | null {
    // If code field exists and is not empty, use it
    if (course.code && course.code.trim()) {
        return course.code.trim().toUpperCase();
    }

    // Try to extract from name field (e.g., "COM101-Communication Skills")
    if (course.name) {
        // Trim whitespace first, then match pattern like "CSE301"
        const trimmedName = course.name.trim();
        const match = trimmedName.match(/^([A-Z]{2,4}\d{3})/i);
        if (match) {
            return match[1].toUpperCase();
        }
    }

    return null;
}

/**
 * Get the numeric level of a course (e.g., 301 from CSE301)
 */
function getCourseLevel(code: string | null): number {
    if (!code) return 0;
    const numMatch = code.match(/\d+/);
    return numMatch ? parseInt(numMatch[0], 10) : 0;
}

/**
 * Get the prefix of a course code (e.g., "CSE" from "CSE301")
 */
function getCoursePrefix(code: string | null): string {
    if (!code) return '';
    const prefixMatch = code.match(/^[A-Z]+/i);
    return prefixMatch ? prefixMatch[0].toUpperCase() : '';
}

/**
 * Check if a course is a Core/Mandatory course
 */
function isCoreCourse(course: CourseForRequirements): boolean {
    const t = course.type?.toLowerCase() || '';
    return t === 'core' ||
        t === 'mandatory (core)' ||
        t.includes('mandatory') ||
        (t.includes('core') && !t.includes('elective'));
}

/**
 * Check if a course is an SSH elective
 */
export function isSSHCourse(course: CourseForRequirements): boolean {
    // FAIL-SAFE: Core courses never count as SSH electives
    if (isCoreCourse(course)) return false;

    // Check type field - explicit SSH type
    const t = course.type?.toUpperCase() || '';
    if (t === 'SSH' || t.includes('SSH') || t.includes('SOCIAL SCIENCE') || t.includes('HUMANITIES')) {
        return true;
    }

    // Check code prefix
    const code = getCourseCode(course);
    if (code) {
        const prefix = getCoursePrefix(code);
        return SSH_PREFIXES.includes(prefix);
    }

    return false;
}

/**
 * Check if a course is a CSE elective (3xx+ level, non-core)
 * Also counts CSE9xx online courses toward this bucket
 */
export function isCSEElective(course: CourseForRequirements): boolean {
    // Must NOT be core
    if (isCoreCourse(course)) return false;

    // Check for elective type OR online course type (for CSE9xx)
    const t = course.type?.toLowerCase() || '';
    const isElectiveType = t === 'department elective' ||
        t === 'elective' ||
        t === 'open elective' ||
        t === 'oc' ||
        t === 'online course' ||
        t.includes('elective') ||
        t.includes('online');

    if (!isElectiveType) return false;

    // Must have a CSE prefix and be 3xx+
    const code = getCourseCode(course);
    if (!code) return false;

    const prefix = getCoursePrefix(code);
    if (!CSE_PREFIXES.includes(prefix)) return false;

    const level = getCourseLevel(code);
    if (level < 300) return false;

    return true;
}

/**
 * Check if a course is Self Growth
 */
export function isSGCourse(course: CourseForRequirements): boolean {
    const t = course.type?.toLowerCase() || '';
    if (t === 'sg' || t === 'self growth' || t.includes('self growth')) return true;

    // Check code
    const code = getCourseCode(course);
    if (code?.startsWith('SG')) return true;

    // Check name for "Self Growth"
    if (course.name?.toLowerCase().includes('self growth')) return true;

    return false;
}

/**
 * Check if a course is Community Work
 */
export function isCWCourse(course: CourseForRequirements): boolean {
    const t = course.type?.toLowerCase() || '';
    if (t === 'cw' || t === 'community work' || t.includes('community work')) return true;

    // Check code
    const code = getCourseCode(course);
    if (code?.startsWith('CW')) return true;

    // Check name for "Community Work" (handles MSC491-Community Work)
    if (course.name?.toLowerCase().includes('community work')) return true;

    return false;
}

/**
 * Check if a course is an Online Course
 */
export function isOnlineCourse(course: CourseForRequirements): boolean {
    const t = course.type?.toLowerCase() || '';
    const name = course.name?.toLowerCase() || '';
    const code = getCourseCode(course);

    // Strict checks by code
    if (code?.startsWith('CSE999') || code?.startsWith('CSE998')) return true;

    // Fallback names/types
    if (t === 'oc' || t === 'online course' || t.includes('online')) return true;
    if (name.includes('distance course') || name.includes('online')) return true;

    return false;
}

/**
 * Check if a course is BTP/Thesis
 */
export function isBTPCourse(course: CourseForRequirements): boolean {
    const code = getCourseCode(course);

    // Primary check: Code starting with BTP
    if (code?.startsWith('BTP')) return true;

    // Fallback: Check for thesis/project type but exclude Community Work (MSC491)
    const t = course.type?.toLowerCase() || '';
    const name = course.name?.toLowerCase() || '';

    if (code?.startsWith('MSC') || name.includes('community work')) return false;
    if (course.credits < 3) return false;

    if (t === 'thesis' || t === 'btp' || t.includes('b.tech project')) return true;
    if (name.includes('b.tech project') || name.includes('thesis')) return true;

    return false;
}

/**
 * Check if a course is Independent Work (IP/IS/UR)
 * Handles codes like: IP101, BIP398, BIS201, BUR301, etc.
 */
export function isIndependentWork(course: CourseForRequirements): boolean {
    const t = course.type?.toLowerCase() || '';
    if (t === 'ip/is/ur' || t.includes('independent')) return true;

    // Check name for "Independent Project" or "Independent Study"
    if (course.name?.toLowerCase().includes('independent project')) return true;
    if (course.name?.toLowerCase().includes('independent study')) return true;
    if (course.name?.toLowerCase().includes('undergraduate research')) return true;

    const code = getCourseCode(course);
    if (!code) return false;

    // Check for IP, IS, UR, BIP, BIS, BUR prefixes
    return code.startsWith('IP') || code.startsWith('IS') || code.startsWith('UR') ||
        code.startsWith('BIP') || code.startsWith('BIS') || code.startsWith('BUR');
}

/**
 * Check if a course is a Math elective (3xx+, non-core)
 */
export function isMathElective(course: CourseForRequirements): boolean {
    if (!course.code) return false;

    // Check prefix
    const prefix = getCoursePrefix(course.code);
    const isMath = MTH_PREFIXES.some(p => course.code!.toUpperCase().startsWith(p));
    if (!isMath) return false; // MTH_PREFIXES handles MTH, MATH

    const level = getCourseLevel(course.code);
    if (level < 300) return false;

    if (isCoreCourse(course)) return false;
    if (isIndependentWork(course)) return false;

    return true;
}

/**
 * Check if a course is an ECE elective (3xx+, non-core)
 */
export function isECEElective(course: CourseForRequirements): boolean {
    if (!course.code) return false;

    const prefix = getCoursePrefix(course.code);
    if (!ECE_PREFIXES.includes(prefix)) return false;

    const level = getCourseLevel(course.code);
    if (level < 300) return false;

    if (isCoreCourse(course)) return false;
    if (isIndependentWork(course)) return false;

    return true;
}

/**
 * Check if a course is a BIO elective (3xx+, non-core)
 */
export function isBioElective(course: CourseForRequirements): boolean {
    if (!course.code) return false;

    const prefix = getCoursePrefix(course.code);
    if (!BIO_PREFIXES.includes(prefix)) return false;

    const level = getCourseLevel(course.code);
    if (level < 300) return false;

    if (isCoreCourse(course)) return false;
    if (isIndependentWork(course)) return false;

    return true;
}

/**
 * Check if a course is a Design elective (3xx+, non-core)
 */
export function isDesElective(course: CourseForRequirements): boolean {
    if (!course.code) return false;

    // Check prefix
    const prefix = getCoursePrefix(course.code);
    if (!DES_PREFIXES.includes(prefix)) return false;

    // Check Level (3xx+)
    const level = getCourseLevel(course.code);
    if (level < 300) return false;

    if (isCoreCourse(course)) return false;
    if (isIndependentWork(course)) return false;

    return true;
}

/**
 * Check if a course is a CSAI elective (3xx+, non-core)
 */
export function isCSAIElective(course: CourseForRequirements): boolean {
    if (!course.code) return false;

    const prefix = getCoursePrefix(course.code);
    if (!CSAI_PREFIXES.includes(prefix)) return false;

    const level = getCourseLevel(course.code);
    if (level < 300) return false;

    if (isCoreCourse(course)) return false;
    if (isIndependentWork(course)) return false;

    return true;
}

/**
 * Check if a course is an EVE elective (3xx+, non-core)
 */
export function isEVEElective(course: CourseForRequirements): boolean {
    if (!course.code) return false;

    const prefix = getCoursePrefix(course.code);
    if (!EVE_PREFIXES.includes(prefix)) return false;

    const level = getCourseLevel(course.code);
    if (level < 300) return false;

    if (isCoreCourse(course)) return false;
    if (isIndependentWork(course)) return false;

    return true;
}

/**
 * Check if a course is successfully completed (not F, W, I, X, N/A)
 */
export function isCompleted(course: CourseForRequirements): boolean {
    const gradeNorm = course.grade?.trim().toUpperCase() || '';
    return !['F', 'W', 'I', 'X', 'N/A', 'WITHDRAW', 'WITHDRAWN'].includes(gradeNorm)
        && !gradeNorm.includes('WITHDRAW');
}

// ============================================================
// Main Calculation Function
// ============================================================

export interface RequirementsProgress {
    total: { earned: number; required: number; percentage: number };
    cseElectives?: { earned: number; required: number; percentage: number; courses: string[] };
    eceElectives?: { earned: number; required: number; percentage: number; courses: string[] };
    eveElectives?: { earned: number; required: number; percentage: number; courses: string[] };
    disciplineElectives?: {
        earned: number;
        required: number;
        percentage: number;
        details?: {
            cseEarned: number;
            minCse: number;
            mathEarned?: number;
            minMath?: number;
            bioEarned?: number;
            minBio?: number;
            desEarned?: number;
            minDes?: number;
        };
        courses: string[];
    };
    ssh: { earned: number; required: number; percentage: number; courses: string[] };
    sg: { earned: number; required: number; completed: boolean };
    cw: { earned: number; required: number; completed: boolean };
    online: { earned: number; max: number; withinLimit: boolean };
    independentWork: { earned: number; max: number; withinLimit: boolean };
    btp: { earned: number; hasBTP: boolean };
    honors: {
        eligible: boolean;
        hasEnoughCredits: boolean;
        hasBTP: boolean;
        hasCgpa: boolean;
        currentCredits: number;
        requiredCredits: number;
    };
}

/**
 * Logic for CSAM
 */
export function calculateCSAMProgress(
    courses: CourseForRequirements[],
    cgpa: number
): RequirementsProgress {
    const reqs = CSAM_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    // --- STEP 1: Handle Capped Categories ---
    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    // --- STEP 2: Main Accumulation ---
    let baseTotal = 0;

    let cseElectiveCredits = 0;
    let mathElectiveCredits = 0;
    let disciplineTotalCredits = 0; // The combined 32-credit bucket

    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const disciplineCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        // Skip capped categories
        if (isOnlineCourse(course) || isIndependentWork(course)) continue;

        baseTotal += course.credits;

        // 1. Discipline Electives (CSE + Math)
        const isCse = isCSEElective(course);
        const isMath = isMathElective(course);

        if (isCse) {
            cseElectiveCredits += course.credits;
            disciplineTotalCredits += course.credits;
            disciplineCourses.push(getCourseCode(course) || course.type);
        } else if (isMath) {
            mathElectiveCredits += course.credits;
            disciplineTotalCredits += course.credits;
            disciplineCourses.push(getCourseCode(course) || course.type);
        }

        // 2. SSH Credits
        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(getCourseCode(course) || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    // --- STEP 3: Final Totals ---
    const finalTotalCredits = baseTotal + validOnline + validIndependent;

    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        disciplineElectives: {
            earned: disciplineTotalCredits,
            required: reqs.disciplineTotal,
            percentage: Math.min(100, Math.round((disciplineTotalCredits / reqs.disciplineTotal) * 100)),
            details: {
                cseEarned: cseElectiveCredits,
                minCse: reqs.minCseCredits,
                mathEarned: mathElectiveCredits,
                minMath: reqs.minMathCredits
            },
            courses: disciplineCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: { earned: sgCredits, required: reqs.sgCredits, completed: sgCredits >= reqs.sgCredits },
        cw: { earned: cwCredits, required: reqs.cwCredits, completed: cwCredits >= reqs.cwCredits },
        online: { earned: rawOnline, max: reqs.maxOnlineCredits, withinLimit: rawOnline <= reqs.maxOnlineCredits },
        independentWork: { earned: rawIndependent, max: reqs.maxIndependentCredits, withinLimit: rawIndependent <= reqs.maxIndependentCredits },
        btp: { earned: btpCredits, hasBTP },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits, hasBTP, hasCgpa,
            currentCredits: finalTotalCredits, requiredCredits: reqs.honors.totalCredits
        }
    };
}

/**
 * Logic for ECE
 */
export function calculateECEProgress(
    courses: CourseForRequirements[],
    cgpa: number
): RequirementsProgress {
    const reqs = ECE_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    // --- STEP 1: Handle Capped Categories ---
    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    // --- STEP 2: Main Accumulation ---
    let baseTotal = 0;
    let eceElectiveCredits = 0;
    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const eceElectiveCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        if (isOnlineCourse(course) || isIndependentWork(course)) continue;

        baseTotal += course.credits;

        // 1. ECE Electives
        if (isECEElective(course)) {
            eceElectiveCredits += course.credits;
            eceElectiveCourses.push(getCourseCode(course) || course.type);
        }

        // 2. SSH Credits
        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(getCourseCode(course) || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    // --- STEP 3: Final Totals ---
    const finalTotalCredits = baseTotal + validOnline + validIndependent;

    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        eceElectives: {
            earned: eceElectiveCredits,
            required: reqs.eceElectiveCredits,
            percentage: Math.min(100, Math.round((eceElectiveCredits / reqs.eceElectiveCredits) * 100)),
            courses: eceElectiveCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: { earned: sgCredits, required: reqs.sgCredits, completed: sgCredits >= reqs.sgCredits },
        cw: { earned: cwCredits, required: reqs.cwCredits, completed: cwCredits >= reqs.cwCredits },
        online: { earned: rawOnline, max: reqs.maxOnlineCredits, withinLimit: rawOnline <= reqs.maxOnlineCredits },
        independentWork: { earned: rawIndependent, max: reqs.maxIndependentCredits, withinLimit: rawIndependent <= reqs.maxIndependentCredits },
        btp: { earned: btpCredits, hasBTP },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits, hasBTP, hasCgpa,
            currentCredits: finalTotalCredits, requiredCredits: reqs.honors.totalCredits
        }
    };
}

/**
 * Logic for CSB
 */
export function calculateCSBProgress(
    courses: CourseForRequirements[],
    cgpa: number
): RequirementsProgress {
    const reqs = CSB_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    // --- STEP 1: Handle Capped Categories ---
    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    // --- STEP 2: Main Accumulation ---
    let baseTotal = 0;

    let cseElectiveCredits = 0;
    let bioElectiveCredits = 0;
    let disciplineTotalCredits = 0; // The combined 32-credit bucket

    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const disciplineCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        // Skip capped categories
        if (isOnlineCourse(course) || isIndependentWork(course)) continue;

        baseTotal += course.credits;

        // 1. Discipline Electives (CSE + BIO)
        const isCse = isCSEElective(course);
        const isBio = isBioElective(course);

        if (isCse) {
            cseElectiveCredits += course.credits;
            disciplineTotalCredits += course.credits;
            disciplineCourses.push(getCourseCode(course) || course.type);
        } else if (isBio) {
            bioElectiveCredits += course.credits;
            disciplineTotalCredits += course.credits;
            disciplineCourses.push(getCourseCode(course) || course.type);
        }

        // 2. SSH Credits
        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(getCourseCode(course) || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    // --- STEP 3: Final Totals ---
    const finalTotalCredits = baseTotal + validOnline + validIndependent;

    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        disciplineElectives: {
            earned: disciplineTotalCredits,
            required: reqs.disciplineTotal,
            percentage: Math.min(100, Math.round((disciplineTotalCredits / reqs.disciplineTotal) * 100)),
            details: {
                cseEarned: cseElectiveCredits,
                minCse: reqs.minCseCredits,
                bioEarned: bioElectiveCredits,
                minBio: reqs.minBioCredits
            },
            courses: disciplineCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: { earned: sgCredits, required: reqs.sgCredits, completed: sgCredits >= reqs.sgCredits },
        cw: { earned: cwCredits, required: reqs.cwCredits, completed: cwCredits >= reqs.cwCredits },
        online: { earned: rawOnline, max: reqs.maxOnlineCredits, withinLimit: rawOnline <= reqs.maxOnlineCredits },
        independentWork: { earned: rawIndependent, max: reqs.maxIndependentCredits, withinLimit: rawIndependent <= reqs.maxIndependentCredits },
        btp: { earned: btpCredits, hasBTP },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits, hasBTP, hasCgpa,
            currentCredits: finalTotalCredits, requiredCredits: reqs.honors.totalCredits
        }
    };
}

export function calculateCSDProgress(
    courses: CourseForRequirements[],
    cgpa: number
): RequirementsProgress {
    const reqs = CSD_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    // --- STEP 1: Handle Capped Categories ---
    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    // --- STEP 2: Main Accumulation ---
    let baseTotal = 0;
    let cseElectiveCredits = 0;
    let desElectiveCredits = 0;
    let disciplineTotalCredits = 0;

    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const disciplineCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        if (isOnlineCourse(course) || isIndependentWork(course)) continue;

        baseTotal += course.credits;

        // 1. Discipline Electives (CSE + DES)
        const isCse = isCSEElective(course);
        const isDes = isDesElective(course);

        if (isCse) {
            cseElectiveCredits += course.credits;
            disciplineTotalCredits += course.credits;
            disciplineCourses.push(getCourseCode(course) || course.type);
        } else if (isDes) {
            desElectiveCredits += course.credits;
            disciplineTotalCredits += course.credits;
            disciplineCourses.push(getCourseCode(course) || course.type);
        }

        // 2. SSH Credits
        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(getCourseCode(course) || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    const finalTotalCredits = baseTotal + validOnline + validIndependent;
    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        disciplineElectives: {
            earned: disciplineTotalCredits,
            required: reqs.disciplineTotal,
            percentage: Math.min(100, Math.round((disciplineTotalCredits / reqs.disciplineTotal) * 100)),
            details: {
                cseEarned: cseElectiveCredits,
                minCse: reqs.minCseCredits,
                desEarned: desElectiveCredits,
                minDes: reqs.minDesCredits
            },
            courses: disciplineCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: { earned: sgCredits, required: reqs.sgCredits, completed: sgCredits >= reqs.sgCredits },
        cw: { earned: cwCredits, required: reqs.cwCredits, completed: cwCredits >= reqs.cwCredits },
        online: { earned: rawOnline, max: reqs.maxOnlineCredits, withinLimit: rawOnline <= reqs.maxOnlineCredits },
        independentWork: { earned: rawIndependent, max: reqs.maxIndependentCredits, withinLimit: rawIndependent <= reqs.maxIndependentCredits },
        btp: { earned: btpCredits, hasBTP },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits, hasBTP, hasCgpa,
            currentCredits: finalTotalCredits, requiredCredits: reqs.honors.totalCredits
        }
    };
}

export function calculateCSAIProgress(
    courses: CourseForRequirements[],
    cgpa: number
): RequirementsProgress {
    const reqs = CSAI_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    let baseTotal = 0;
    let csaiElectiveCredits = 0;
    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const csaiElectiveCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        if (isOnlineCourse(course) || isIndependentWork(course)) continue;

        baseTotal += course.credits;

        if (isCSAIElective(course)) {
            csaiElectiveCredits += course.credits;
            csaiElectiveCourses.push(getCourseCode(course) || course.type);
        }

        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(getCourseCode(course) || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    const finalTotalCredits = baseTotal + validOnline + validIndependent;
    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        cseElectives: {
            earned: csaiElectiveCredits,
            required: reqs.csaiElectiveCredits,
            percentage: Math.min(100, Math.round((csaiElectiveCredits / reqs.csaiElectiveCredits) * 100)),
            courses: csaiElectiveCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: { earned: sgCredits, required: reqs.sgCredits, completed: sgCredits >= reqs.sgCredits },
        cw: { earned: cwCredits, required: reqs.cwCredits, completed: cwCredits >= reqs.cwCredits },
        online: { earned: rawOnline, max: reqs.maxOnlineCredits, withinLimit: rawOnline <= reqs.maxOnlineCredits },
        independentWork: { earned: rawIndependent, max: reqs.maxIndependentCredits, withinLimit: rawIndependent <= reqs.maxIndependentCredits },
        btp: { earned: btpCredits, hasBTP },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits, hasBTP, hasCgpa,
            currentCredits: finalTotalCredits, requiredCredits: reqs.honors.totalCredits
        }
    };
}

function calculateGenericProgress(
    courses: CourseForRequirements[],
    cgpa: number,
    branch: string
): RequirementsProgress {
    const reqs = getRequirementsConstants(branch) as typeof CSE_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    // --- STEP 1: Handle Capped Categories First ---
    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    // --- STEP 2: Main Accumulation Loop ---
    let baseTotal = 0;
    let cseElectiveCredits = 0;
    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const cseElectiveCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        const code = getCourseCode(course);
        const isOC = isOnlineCourse(course);
        const isIP = isIndependentWork(course);
        const isBTP = isBTPCourse(course);

        // Online courses can still count toward CSE elective bucket
        if (isOC && isCSEElective(course)) {
            cseElectiveCredits += course.credits;
            cseElectiveCourses.push(code || course.type);
        }

        // Skip capped categories for baseTotal (they're added via validOnline/validIndependent)
        if (isOC || isIP) {
            continue;
        }

        baseTotal += course.credits;

        if (isCSEElective(course)) {
            cseElectiveCredits += course.credits;
            cseElectiveCourses.push(code || course.type);
        }

        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(code || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    // --- STEP 3: Final Totals ---
    const finalTotalCredits = baseTotal + validOnline + validIndependent;

    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        cseElectives: {
            earned: cseElectiveCredits,
            required: reqs.cseElectiveCredits,
            percentage: Math.min(100, Math.round((cseElectiveCredits / reqs.cseElectiveCredits) * 100)),
            courses: cseElectiveCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: {
            earned: sgCredits,
            required: reqs.sgCredits,
            completed: sgCredits >= reqs.sgCredits
        },
        cw: {
            earned: cwCredits,
            required: reqs.cwCredits,
            completed: cwCredits >= reqs.cwCredits
        },
        online: {
            earned: rawOnline,
            max: reqs.maxOnlineCredits,
            withinLimit: rawOnline <= reqs.maxOnlineCredits
        },
        independentWork: {
            earned: rawIndependent,
            max: reqs.maxIndependentCredits,
            withinLimit: rawIndependent <= reqs.maxIndependentCredits
        },
        btp: {
            earned: btpCredits,
            hasBTP
        },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits,
            hasBTP,
            hasCgpa,
            currentCredits: finalTotalCredits,
            requiredCredits: reqs.honors.totalCredits
        }
    };
}

/**
 * Logic for EVE
 */
export function calculateEVEProgress(
    courses: CourseForRequirements[],
    cgpa: number
): RequirementsProgress {
    const reqs = EVE_REQUIREMENTS;
    const completed = courses.filter(isCompleted);

    let rawOnline = 0;
    let rawIndependent = 0;

    for (const course of completed) {
        if (isOnlineCourse(course)) rawOnline += course.credits;
        if (isIndependentWork(course)) rawIndependent += course.credits;
    }

    const validOnline = Math.min(rawOnline, reqs.maxOnlineCredits);
    const validIndependent = Math.min(rawIndependent, reqs.maxIndependentCredits);

    let baseTotal = 0;
    let eveElectiveCredits = 0;
    let sshCredits = 0;
    let sgCredits = 0;
    let cwCredits = 0;
    let btpCredits = 0;

    const eveElectiveCourses: string[] = [];
    const sshCourses: string[] = [];

    for (const course of completed) {
        if (isOnlineCourse(course) || isIndependentWork(course)) continue;

        baseTotal += course.credits;

        if (isEVEElective(course)) {
            eveElectiveCredits += course.credits;
            eveElectiveCourses.push(getCourseCode(course) || course.type);
        }

        if (isSSHCourse(course)) {
            sshCredits += course.credits;
            sshCourses.push(getCourseCode(course) || course.type);
        }

        if (isSGCourse(course)) sgCredits += course.credits;
        if (isCWCourse(course)) cwCredits += course.credits;
        if (isBTPCourse(course)) btpCredits += course.credits;
    }

    const finalTotalCredits = baseTotal + validOnline + validIndependent;
    const hasEnoughCredits = finalTotalCredits >= reqs.honors.totalCredits;
    const hasBTP = btpCredits > 0;
    const hasCgpa = cgpa >= reqs.honors.minCgpa;

    return {
        total: {
            earned: finalTotalCredits,
            required: reqs.totalCredits,
            percentage: Math.min(100, Math.round((finalTotalCredits / reqs.totalCredits) * 100))
        },
        eveElectives: {
            earned: eveElectiveCredits,
            required: reqs.eveElectiveCredits,
            percentage: Math.min(100, Math.round((eveElectiveCredits / reqs.eveElectiveCredits) * 100)),
            courses: eveElectiveCourses
        },
        ssh: {
            earned: sshCredits,
            required: reqs.sshCredits,
            percentage: Math.min(100, Math.round((sshCredits / reqs.sshCredits) * 100)),
            courses: sshCourses
        },
        sg: { earned: sgCredits, required: reqs.sgCredits, completed: sgCredits >= reqs.sgCredits },
        cw: { earned: cwCredits, required: reqs.cwCredits, completed: cwCredits >= reqs.cwCredits },
        online: { earned: rawOnline, max: reqs.maxOnlineCredits, withinLimit: rawOnline <= reqs.maxOnlineCredits },
        independentWork: { earned: rawIndependent, max: reqs.maxIndependentCredits, withinLimit: rawIndependent <= reqs.maxIndependentCredits },
        btp: { earned: btpCredits, hasBTP },
        honors: {
            eligible: hasEnoughCredits && hasBTP && hasCgpa,
            hasEnoughCredits, hasBTP, hasCgpa,
            currentCredits: finalTotalCredits, requiredCredits: reqs.honors.totalCredits
        }
    };
}

export function calculateRequirementsProgress(
    courses: CourseForRequirements[],
    cgpa: number,
    branch: string = 'CSE'
): RequirementsProgress {
    switch (branch) {
        case 'CSSS': return calculateGenericProgress(courses, cgpa, branch); // Actually uses generic but constants are different
        case 'CSAM': return calculateCSAMProgress(courses, cgpa);
        case 'ECE': return calculateECEProgress(courses, cgpa);
        case 'CSB': return calculateCSBProgress(courses, cgpa);
        case 'CSD': return calculateCSDProgress(courses, cgpa);
        case 'CSAI': return calculateCSAIProgress(courses, cgpa);
        case 'EVE': return calculateEVEProgress(courses, cgpa);
        default: return calculateGenericProgress(courses, cgpa, branch);
    }
}
