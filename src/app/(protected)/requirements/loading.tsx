import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function RequirementsLoading() {
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="space-y-2">
                <Skeleton className="h-9 w-[300px]" />
                <Skeleton className="h-5 w-[200px]" />
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-[140px]" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-4 w-[50px]" />
                            </div>
                            <Skeleton className="h-3 w-full rounded-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
