import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, GraduationCap, FileText, Presentation, Clock } from "lucide-react"
import { differenceInDays, isBefore, isWithinInterval, format } from "date-fns"

export const dynamic = "force-dynamic";

// Academic Calendar Events for 2026
const academicEvents = [
    {
        id: "midsem",
        title: "Midsemester Exams",
        startDate: new Date(2026, 1, 21), // Feb 21
        endDate: new Date(2026, 1, 28),   // Feb 28
        icon: FileText,
        color: "bg-violet-500",
        lightColor: "text-violet-100",
    },
    {
        id: "btp-report",
        title: "BTP Report Submission",
        startDate: new Date(2026, 3, 21), // Apr 21
        endDate: new Date(2026, 3, 21),
        icon: FileText,
        color: "bg-amber-500",
        lightColor: "text-amber-100",
    },
    {
        id: "endsem",
        title: "Endsemester Exams",
        startDate: new Date(2026, 3, 23), // Apr 23
        endDate: new Date(2026, 4, 2),    // May 2
        icon: GraduationCap,
        color: "bg-blue-500",
        lightColor: "text-blue-100",
    },
    {
        id: "btp-presentation",
        title: "BTP Presentation",
        startDate: new Date(2026, 4, 4),  // May 4
        endDate: new Date(2026, 4, 4),
        icon: Presentation,
        color: "bg-emerald-500",
        lightColor: "text-emerald-100",
    },
    {
        id: "cw-presentation",
        title: "CW Presentation",
        startDate: new Date(2026, 4, 5),  // May 5
        endDate: new Date(2026, 4, 5),
        icon: Presentation,
        color: "bg-cyan-500",
        lightColor: "text-cyan-100",
    },
    {
        id: "sg-presentation",
        title: "SG Presentation",
        startDate: new Date(2026, 4, 6),  // May 6
        endDate: new Date(2026, 4, 6),
        icon: Presentation,
        color: "bg-pink-500",
        lightColor: "text-pink-100",
    },
]

function getEventStatus(event: typeof academicEvents[0]) {
    const now = new Date();

    if (isBefore(now, event.startDate)) {
        return {
            status: "UPCOMING" as const,
            days: differenceInDays(event.startDate, now),
            label: `${differenceInDays(event.startDate, now)} days left`
        };
    } else if (isWithinInterval(now, { start: event.startDate, end: event.endDate })) {
        return {
            status: "ONGOING" as const,
            days: 0,
            label: "Happening Now!"
        };
    } else {
        return {
            status: "DONE" as const,
            days: -1,
            label: "Completed"
        };
    }
}

export default async function CalendarPage() {
    const session = await auth()
    if (!session) redirect("/login")

    // Sort events by start date
    const sortedEvents = [...academicEvents].sort((a, b) =>
        a.startDate.getTime() - b.startDate.getTime()
    );

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                    <CalendarDays className="h-10 w-10 text-primary" />
                    Academic Calendar
                </h1>
                <p className="text-lg text-muted-foreground">
                    Important dates for Winter 2026
                </p>
            </header>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {sortedEvents.map((event) => {
                    const eventStatus = getEventStatus(event);
                    const Icon = event.icon;
                    const isUrgent = eventStatus.status === "UPCOMING" && eventStatus.days <= 7;
                    const isDone = eventStatus.status === "DONE";

                    return (
                        <Card
                            key={event.id}
                            className={`${isDone ? "bg-muted opacity-60" : event.color} border-none shadow-none rounded-xl p-6 transition-transform hover:scale-[1.02]`}
                        >
                            <CardContent className="p-0 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`h-6 w-6 ${isDone ? "text-muted-foreground" : "text-white"}`} />
                                        <h3 className={`text-lg font-bold ${isDone ? "text-muted-foreground" : "text-white"}`}>
                                            {event.title}
                                        </h3>
                                    </div>
                                    {eventStatus.status === "ONGOING" && (
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                                            LIVE
                                        </span>
                                    )}
                                </div>

                                <div className={`text-4xl font-extrabold tracking-tighter ${isDone ? "text-muted-foreground" : "text-white"}`}>
                                    {eventStatus.status === "ONGOING" ? (
                                        "🔥"
                                    ) : eventStatus.status === "DONE" ? (
                                        "✓"
                                    ) : (
                                        <>
                                            {format(event.startDate, "MMM d")}
                                            {event.startDate.getTime() !== event.endDate.getTime() &&
                                                ` - ${format(event.endDate, "d")}`
                                            }
                                        </>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className={`text-sm font-medium ${isDone ? "text-muted-foreground" : event.lightColor}`}>
                                        {eventStatus.status === "UPCOMING"
                                            ? `${eventStatus.days} days left`
                                            : eventStatus.label
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Info Footer */}
            <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                <p>Dates are based on the IIIT Delhi academic calendar. Always verify with official sources.</p>
            </div>
        </div>
    )
}
