import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { calculateCGPA } from "@/lib/gpa-calculations"
import { calculateRequirementsProgress } from "@/lib/graduation-requirements"
import { GraduationRequirementsDisplay } from "@/components/graduation-requirements"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default async function RequirementsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    let user
    try {
        user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                semesters: {
                    include: { courses: true },
                    orderBy: { semesterNum: 'asc' }
                }
            }
        })
    } catch {
        return (
            <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex items-center justify-center">
                <Card className="max-w-md w-full p-8 text-center space-y-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                    <h2 className="text-2xl font-bold">Database Unavailable</h2>
                    <p className="text-muted-foreground">We couldn&apos;t connect to the database. Your data is safe — please try again later.</p>
                    <Link href="/"><Button variant="outline">Go Home</Button></Link>
                </Card>
            </div>
        )
    }

    if (!user) notFound()
    if (!user.batch) redirect("/onboarding")

    // Flatten all courses
    const allCourses = user.semesters.flatMap(sem => sem.courses)

    // Calculate CGPA
    const { cgpa } = calculateCGPA(user.semesters, user.semesters.length)

    // Calculate progress
    const branch = user.branch || 'CSE';
    const progress = calculateRequirementsProgress(allCourses, cgpa, branch)


    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Graduation Requirements
                </h1>
                <p className="text-muted-foreground">
                    B.Tech {branch} • Batch {user.batch}
                </p>
            </header>

            <GraduationRequirementsDisplay
                progress={progress}
                cgpa={cgpa}
            />
        </div>
    )
}
