import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function CalendarLoading() {
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <header className="space-y-2">
                <Skeleton className="h-10 w-[280px]" />
                <Skeleton className="h-5 w-[220px]" />
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="border-none shadow-none bg-muted">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 rounded" />
                                <Skeleton className="h-5 w-[180px]" />
                            </div>
                            <Skeleton className="h-10 w-[120px]" />
                            <Skeleton className="h-4 w-[100px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
