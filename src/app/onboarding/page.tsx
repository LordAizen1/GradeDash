import { auth } from "@/auth"
import { OnboardingForm } from "@/components/onboarding-form"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // @ts-ignore
    if (session.user?.batch) {
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-8">
            <OnboardingForm />
        </div>
    )
}
