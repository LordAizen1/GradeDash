"use client"

import { TrendingUp } from "lucide-react"
import { Bar, Area, ComposedChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface DashboardChartsProps {
    sgpaData: { name: string; sgpa: number; cgpa?: number; credits: number }[]
}

const chartConfig = {
    sgpa: {
        label: "SGPA",
        color: "hsl(var(--chart-1))",
    },
    cgpa: {
        label: "CGPA",
        color: "hsl(var(--chart-2))",
    },
    credits: {
        label: "Credits",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function DashboardCharts({ sgpaData }: DashboardChartsProps) {
    if (sgpaData.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center p-8 bg-muted/20 border-dashed">
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground text-lg">No progress tracked yet.</p>
                    <p className="text-sm text-zinc-500">Add your semesters to visualize your growth.</p>
                </div>
            </Card>
        )
    }

    // Calculate trend if possible (using SGPA)
    let trendPercentage = 0;
    if (sgpaData.length >= 2) {
        const last = sgpaData[sgpaData.length - 1].sgpa;
        const previous = sgpaData[sgpaData.length - 2].sgpa;
        if (previous > 0) {
            trendPercentage = ((last - previous) / previous) * 100;
        }
    }

    return (
        <Card className="shadow-none border-border">
            <CardHeader>
                <CardTitle>Academic Progression</CardTitle>
                <CardDescription>
                    Tracking your SGPA, Cumulative GPA, and Credits over time
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ComposedChart
                        accessibilityLayer
                        data={sgpaData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 8)}
                            scale="point"
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 10]}
                            hide
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <defs>
                            <linearGradient id="fillSgpa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-sgpa)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-sgpa)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillCgpa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-cgpa)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-cgpa)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Bar
                            dataKey="credits"
                            yAxisId="right"
                            fill="var(--color-credits)"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            fillOpacity={0.6}
                        />
                        <Area
                            dataKey="cgpa"
                            yAxisId="left"
                            type="natural"
                            fill="url(#fillCgpa)"
                            fillOpacity={0.4}
                            stroke="var(--color-cgpa)"
                            stackId="a"
                        />
                        <Area
                            dataKey="sgpa"
                            yAxisId="left"
                            type="natural"
                            fill="url(#fillSgpa)"
                            fillOpacity={0.4}
                            stroke="var(--color-sgpa)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {trendPercentage > 0 ? (
                                <>SGPA Trending up by {trendPercentage.toFixed(1)}% <TrendingUp className="h-4 w-4" /></>
                            ) : trendPercentage < 0 ? (
                                <>SGPA Trending down by {Math.abs(trendPercentage).toFixed(1)}%</>
                            ) : (
                                <>Maintained performance</>
                            )}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            Semesters {sgpaData[0].name.split(" ")[1]} - {sgpaData[sgpaData.length - 1].name.split(" ")[1]}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
