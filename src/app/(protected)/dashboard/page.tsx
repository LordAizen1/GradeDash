import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { calculateCGPA, calculateSGPA } from "@/lib/gpa-calculations"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardCharts } from "@/components/dashboard-charts"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await auth()

    if (!session) redirect("/login")
    // @ts-ignore
    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id! },
        include: {
            semesters: {
                include: { courses: true },
                orderBy: { semesterNum: 'asc' }
            }
        }
    })

    if (!user) return <div>User not found</div>

    // Check if user is onboarded using the fresh DB record, not the stale session
    if (!user.batch) redirect("/onboarding")

    // Calculate Stats
    const { cgpa, earnedCredits, removedCredits } = calculateCGPA(user.semesters, user.semesters.length)
    const numericCgpa = cgpa

    // Format data for charts
    // Format data for charts
    const sgpaData = user.semesters.map((sem: any) => {
        let name = "";
        if (sem.type === "SUMMER") {
            // Logic to determine Summer Term number 
            // Reuse logic: (Regular sems before this) / 2
            const regularSemsBefore = user.semesters.filter((s: any) => s.type === "REGULAR" && s.semesterNum < sem.semesterNum).length;
            const summerTermNum = Math.floor(regularSemsBefore / 2);
            name = `Summer ${summerTermNum || 1}`;
        } else {
            // Logic for Regular Sem number
            const regularSemNum = user.semesters.filter((s: any) => s.type === "REGULAR" && s.semesterNum <= sem.semesterNum).length;
            name = `Sem ${regularSemNum}`;
        }

        // Calculate Running CGPA
        const previousSemesters = user.semesters.filter((s: any) => s.semesterNum <= sem.semesterNum);
        const { cgpa } = calculateCGPA(previousSemesters, previousSemesters.length);

        // Calculate Semester Credits (Completed)
        const semCredits = sem.courses.reduce((sum: number, course: any) => {
            // exclude failed/withdrawn courses
            return ["F", "W", "I", "X"].includes(course.grade) ? sum : sum + course.credits;
        }, 0);

        return {
            name,
            sgpa: sem.sgpa || calculateSGPA(sem.courses),
            cgpa: cgpa,
            credits: semCredits
        }
    })

    const isEmpty = user.semesters.length === 0
    const regularSemCount = user.semesters.filter((s: any) => s.type === "REGULAR").length;
    const summerSemCount = user.semesters.filter((s: any) => s.type === "SUMMER").length;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12">
            {/* ... Header ... */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-0">
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tight text-foreground">
                        Welcome, {user.name?.split(" ")[0]}
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        Batch {user.batch} • {user.branch} • Sem {user.currentSem}
                    </p>
                </div>

                {!isEmpty && (
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Current CGPA</p>
                            <div className={`text-4xl font-extrabold ${numericCgpa >= 8.5 ? 'text-secondary' :
                                numericCgpa >= 7.0 ? 'text-accent' :
                                    'text-destructive'
                                }`}>
                                <AnimatedCounter value={numericCgpa} />
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {isEmpty ? (
                // ... Empty State ...
                <div className="flex flex-col items-center justify-center p-12 bg-muted rounded-lg text-center h-[50vh]">
                    {/* ... */}
                </div>
            ) : (
                <>
                    {/* Stats Grid - Color Block Cards */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* CGPA Card */}
                        <Card className="bg-primary border-none shadow-none rounded-lg p-6 group transition-transform hover:scale-[1.02] cursor-default">
                            <CardContent className="p-0 space-y-4">
                                <p className="text-blue-100 uppercase tracking-wider font-bold text-sm">Cumulative GPA</p>
                                <div className="text-6xl font-extrabold text-white tracking-tighter">
                                    <AnimatedCounter value={numericCgpa} />
                                </div>
                                <p className="text-sm text-blue-100 font-medium">
                                    {removedCredits > 0 ? `${removedCredits} worst credits removed` : "All credits included"}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Credits Card */}
                        <Card className="bg-secondary border-none shadow-none rounded-lg p-6 group transition-transform hover:scale-[1.02] cursor-default">
                            <CardContent className="p-0 space-y-4">
                                <p className="text-green-100 uppercase tracking-wider font-bold text-sm">Credits Earned</p>
                                <div className="text-6xl font-extrabold text-white tracking-tighter">
                                    <AnimatedCounter value={earnedCredits} />
                                </div>
                                <p className="text-sm text-green-100 font-medium">
                                    Successful completions
                                </p>
                            </CardContent>
                        </Card>

                        {/* Semester Count Card */}
                        <Link href="/semesters" className="block h-full">
                            <Card className="bg-muted border-none shadow-none rounded-lg p-6 h-full group hover:bg-accent transition-all duration-200 cursor-pointer">
                                <CardContent className="p-0 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start">
                                        <p className="text-muted-foreground uppercase tracking-wider font-bold text-sm">Semesters</p>
                                        <ArrowUpRight className="h-6 w-6 text-foreground transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                    <div>
                                        <div className="text-6xl font-extrabold text-foreground tracking-tighter mb-2">
                                            {regularSemCount}
                                        </div>
                                        <p className="text-sm text-muted-foreground font-semibold group-hover:text-foreground">
                                            + {summerSemCount} Summer Term{summerSemCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Chart Section */}
                    <div className="grid grid-cols-1">
                        <DashboardCharts sgpaData={sgpaData} />
                    </div>
                </>
            )}
        </div>
    )
}
