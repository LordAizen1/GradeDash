"use client";

import { useEffect, useState } from "react";
import { differenceInDays, isWithinInterval, isBefore } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type ExamStatus = {
    type: string;
    days: number;
    status: "UPCOMING" | "ONGOING" | "DONE";
};

function useExamCountdown(): ExamStatus {
    const [timeLeft, setTimeLeft] = useState<ExamStatus>({
        type: "",
        days: 0,
        status: "DONE"
    });

    useEffect(() => {
        const calculateTime = (): ExamStatus => {
            const now = new Date();
            const currentYear = now.getFullYear();

            const midsemStart = new Date(currentYear, 1, 21);
            const midsemEnd = new Date(currentYear, 1, 28);
            const endsemStart = new Date(currentYear, 3, 23);
            const endsemEnd = new Date(currentYear, 4, 2);

            if (isBefore(now, midsemStart)) {
                return { type: "Midsem Exams", days: differenceInDays(midsemStart, now), status: "UPCOMING" };
            } else if (isWithinInterval(now, { start: midsemStart, end: midsemEnd })) {
                return { type: "Midsem Exams", days: 0, status: "ONGOING" };
            }

            if (isBefore(now, endsemStart)) {
                return { type: "Endsem Exams", days: differenceInDays(endsemStart, now), status: "UPCOMING" };
            } else if (isWithinInterval(now, { start: endsemStart, end: endsemEnd })) {
                return { type: "Endsem Exams", days: 0, status: "ONGOING" };
            }

            return { type: "Summer Break", days: 0, status: "DONE" };
        };

        setTimeLeft(calculateTime());
        const interval = setInterval(() => setTimeLeft(calculateTime()), 60000);
        return () => clearInterval(interval);
    }, []);

    return timeLeft;
}

// Main component for sidebar
export function ExamCountdownButton() {
    const exam = useExamCountdown();

    if (exam.status === "DONE") return null;

    const isUrgent = exam.days <= 7;

    return (
        <SidebarMenuItem>
            <Popover>
                <PopoverTrigger asChild>
                    <SidebarMenuButton tooltip="Exam Countdown" className="relative">
                        <CalendarDays className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">Exams</span>
                        {/* Badge showing days */}
                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full group-data-[collapsible=icon]:hidden ${exam.status === "ONGOING"
                                ? "bg-green-500/20 text-green-500"
                                : isUrgent
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-violet-500/20 text-violet-500"
                            }`}>
                            {exam.status === "ONGOING" ? "NOW" : `${exam.days}d`}
                        </span>
                    </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent side="right" className="w-72">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-violet-500" />
                            <h4 className="font-semibold">{exam.type}</h4>
                        </div>

                        {exam.status === "ONGOING" ? (
                            <div className="text-center py-4">
                                <div className="text-4xl mb-2">🍀</div>
                                <p className="text-sm text-muted-foreground">Good luck! You got this.</p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className={`text-5xl font-bold ${isUrgent ? "text-red-500" : "text-violet-500"}`}>
                                    {exam.days}
                                </div>
                                <p className="text-sm text-muted-foreground">days remaining</p>
                            </div>
                        )}

                        <div className="text-xs text-muted-foreground border-t pt-3">
                            <div className="flex justify-between">
                                <span>Midsems:</span>
                                <span>Feb 21 - Feb 28</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span>Endsems:</span>
                                <span>Apr 23 - May 2</span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </SidebarMenuItem>
    );
}

// Keep the old export for backwards compatibility (returns null now since we moved it)
export function ExamCountdown() {
    return null;
}
