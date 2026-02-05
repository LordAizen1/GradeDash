import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SemestersLoading() {
    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-[250px]" />
                    <Skeleton className="h-5 w-[320px]" />
                </div>
            </header>

            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-[150px]" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[60px]" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
