import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SemesterList } from "@/components/semester-list"

export default async function SemestersPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const semesters = await prisma.semester.findMany({
        where: { userId: session.user.id },
        include: { courses: true },
        orderBy: { semesterNum: 'asc' }
    })

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-0 pb-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Semester Manager</h1>
                    <p className="text-muted-foreground mt-2">Manage your academic history and grades.</p>
                </div>
            </header>

            <SemesterList semesters={semesters} />
        </div>
    )
}
