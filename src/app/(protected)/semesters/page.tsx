import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SemesterList } from "@/components/semester-list"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function SemestersPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    let semesters
    try {
        semesters = await prisma.semester.findMany({
            where: { userId: session.user.id },
            include: { courses: true },
            orderBy: { semesterNum: 'asc' }
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

    const isGuest = session.user.email === "guest@grade-dash.demo"

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-0 pb-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Semester Manager</h1>
                    <p className="text-muted-foreground mt-2">Manage your academic history and grades.</p>
                </div>
            </header>

            <SemesterList semesters={semesters} isGuest={isGuest} />
        </div>
    )
}
