"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { z } from "zod"

const onboardingSchema = z.object({
    batch: z.coerce.number().min(2020, "Batch must be 2020 or later").max(2030, "Batch too far in future"),
    branch: z.string().min(1, "Branch is required"),
    currentSem: z.coerce.number().min(1).max(10, "Semester must be valid"),
})

export async function completeOnboarding(formData: FormData) {
    const session = await auth()
    if (!session?.user || !session.user.id) {
        throw new Error("Unauthorized")
    }

    const rawData = {
        batch: formData.get("batch"),
        branch: formData.get("branch"),
        currentSem: formData.get("currentSem"),
    }

    const parsed = onboardingSchema.safeParse(rawData)

    if (!parsed.success) {
        console.error("Validation error:", parsed.error)
        throw new Error("Invalid form data")
    }

    const { batch, branch, currentSem } = parsed.data

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            batch,
            branch,
            currentSem,
        },
    })

    redirect("/dashboard")
}
