// Update this file each semester with new academic dates.
// Dates are based on the IIIT Delhi academic calendar.

export interface AcademicEvent {
    id: string
    title: string
    startDate: Date
    endDate: Date
    icon: "FileText" | "GraduationCap" | "Presentation" | "Clock"
    color: string
    lightColor: string
}

export const academicEvents: AcademicEvent[] = [
    {
        id: "midsem",
        title: "Midsemester Exams",
        startDate: new Date(2026, 1, 21), // Feb 21
        endDate: new Date(2026, 1, 28),   // Feb 28
        icon: "FileText",
        color: "bg-violet-500",
        lightColor: "text-violet-100",
    },
    {
        id: "btp-report",
        title: "BTP Report Submission",
        startDate: new Date(2026, 3, 21), // Apr 21
        endDate: new Date(2026, 3, 21),
        icon: "FileText",
        color: "bg-amber-500",
        lightColor: "text-amber-100",
    },
    {
        id: "endsem",
        title: "Endsemester Exams",
        startDate: new Date(2026, 3, 23), // Apr 23
        endDate: new Date(2026, 4, 2),    // May 2
        icon: "GraduationCap",
        color: "bg-blue-500",
        lightColor: "text-blue-100",
    },
    {
        id: "btp-presentation",
        title: "BTP Presentation",
        startDate: new Date(2026, 4, 4),  // May 4
        endDate: new Date(2026, 4, 4),
        icon: "Presentation",
        color: "bg-emerald-500",
        lightColor: "text-emerald-100",
    },
    {
        id: "cw-presentation",
        title: "CW Presentation",
        startDate: new Date(2026, 4, 5),  // May 5
        endDate: new Date(2026, 4, 5),
        icon: "Presentation",
        color: "bg-cyan-500",
        lightColor: "text-cyan-100",
    },
    {
        id: "sg-presentation",
        title: "SG Presentation",
        startDate: new Date(2026, 4, 6),  // May 6
        endDate: new Date(2026, 4, 6),
        icon: "Presentation",
        color: "bg-pink-500",
        lightColor: "text-pink-100",
    },
]
