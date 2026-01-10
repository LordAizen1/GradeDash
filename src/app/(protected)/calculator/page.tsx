import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { calculateCGPA } from "@/lib/gpa-calculations"
import { HypotheticalCalculator } from "@/components/hypothetical-calculator"

export default async function CalculatorPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            semesters: {
                include: { courses: true }
            }
        }
    })

    if (!user) return <div>User not found</div>

    const { cgpa, calculateCgpaCredits } = calculateCGPA(user.semesters, user.semesters.length)

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-0 pb-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Hypothetical Calculator</h1>
                    <p className="text-muted-foreground mt-2">Plan your academic future by simulating future grades.</p>
                </div>
            </header>

            <HypotheticalCalculator
                currentCGPA={cgpa}
                currentCredits={calculateCgpaCredits}
                totalCreditsRequired={156} // Default B.Tech
            />
        </div>
    )
}
