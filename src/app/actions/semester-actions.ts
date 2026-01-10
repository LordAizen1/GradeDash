"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { calculateSGPA } from "@/lib/gpa-calculations"

const courseSchema = z.object({
    name: z.string().min(1),
    credits: z.coerce.number(),
    grade: z.string(),
    type: z.string().default("Core"),
    excludeFromCGPA: z.boolean().default(false),
})

export async function addSemester(semesterNum: number, type: "REGULAR" | "SUMMER" = "REGULAR") {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.semester.create({
        data: {
            userId: session.user.id,
            semesterNum,
            type
        }
    })
    revalidatePath("/semesters")
}

export async function deleteSemester(semesterId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.semester.delete({
        where: {
            id: semesterId,
            userId: session.user.id // Security check
        }
    })
    revalidatePath("/semesters")
}

export async function addCourse(semesterId: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const rawData = {
        name: formData.get("name"),
        credits: formData.get("credits"),
        grade: formData.get("grade"),
        type: formData.get("type"),
        excludeFromCGPA: formData.get("excludeFromCGPA") === "on",
    }

    const parsed = courseSchema.parse(rawData)

    // Calculate points
    const { GRADE_POINTS } = await import("@/lib/gpa-calculations")
    let gradePoints = GRADE_POINTS[parsed.grade] || 0
    if (parsed.grade === "F") gradePoints = 2; // Default SGPA F logic, can be overridden

    await prisma.course.create({
        data: {
            semesterId,
            ...parsed,
            gradePoints,
        }
    })

    // Update SGPA
    await updateSemesterSGPA(semesterId)

    revalidatePath("/semesters")
    revalidatePath("/dashboard")
}

export async function deleteCourse(courseId: string, semesterId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.course.delete({ where: { id: courseId } })
    await updateSemesterSGPA(semesterId)
    revalidatePath("/semesters")
    revalidatePath("/dashboard")
}

async function updateSemesterSGPA(semesterId: string) {
    const sem = await prisma.semester.findUnique({
        where: { id: semesterId },
        include: { courses: true }
    })
    if (sem) {
        const sgpa = calculateSGPA(sem.courses)
        await prisma.semester.update({
            where: { id: semesterId },
            data: { sgpa }
        })
    }
}
