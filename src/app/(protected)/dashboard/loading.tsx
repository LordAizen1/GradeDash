import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardLoading() {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-[100px]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-1" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[250px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <Skeleton className="h-9 w-9 rounded-full mr-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-3 w-[100px]" />
                                    </div>
                                    <Skeleton className="h-4 w-[40px] ml-auto" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
