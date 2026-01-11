import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { calculateCGPA } from "@/lib/gpa-calculations"
import { calculateRequirementsProgress, getRequirementsConstants } from "@/lib/graduation-requirements"
import { GraduationRequirementsDisplay } from "@/components/graduation-requirements"

export const dynamic = "force-dynamic";

export default async function RequirementsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            semesters: {
                include: { courses: true },
                orderBy: { semesterNum: 'asc' }
            }
        }
    })

    if (!user) return <div>User not found</div>
    if (!user.batch) redirect("/onboarding")

    // Flatten all courses
    const allCourses = user.semesters.flatMap(sem => sem.courses)

    // Calculate CGPA
    const { cgpa } = calculateCGPA(user.semesters, user.semesters.length)

    // Calculate progress
    const branch = user.branch || 'CSE';
    const progress = calculateRequirementsProgress(allCourses, cgpa, branch)
    const requirements = getRequirementsConstants(branch);

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
                requirements={requirements}
            />
        </div>
    )
}
