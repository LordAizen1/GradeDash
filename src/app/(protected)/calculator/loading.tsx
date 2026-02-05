import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CalculatorLoading() {
    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-[300px]" />
                    <Skeleton className="h-5 w-[400px]" />
                </div>
            </header>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-[200px]" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-12 w-[180px]" />
                </CardContent>
            </Card>
        </div>
    )
}
