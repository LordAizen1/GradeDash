"use client"

import { Semester, Course } from "@prisma/client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { AddCourseDialog } from "./add-course-dialog"
import { UploadTranscriptDialog } from "./upload-transcript-dialog"
import { deleteCourse, addSemester, deleteSemester } from "@/app/actions/semester-actions"
import { Trash2, CirclePlus, X } from "lucide-react"
import { calculateCGPA } from "@/lib/gpa-calculations"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SemesterListProps {
    semesters: (Semester & { courses: Course[] })[]
}

export function SemesterList({ semesters }: SemesterListProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg border border-border">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Academic Timeline</h3>
                    <p className="text-sm text-muted-foreground">Add semesters to track your progress</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end mt-2 md:mt-0">
                    <UploadTranscriptDialog />
                    <form action={() => addSemester((semesters.length > 0 ? semesters[semesters.length - 1].semesterNum : 0) + 1, "SUMMER")}>
                        <Button type="submit" variant="secondary" size="lg" className="shadow-none font-semibold w-full md:w-auto">
                            <CirclePlus className="mr-2 h-4 w-4" /> Add Summer
                        </Button>
                    </form>
                    <form action={() => addSemester((semesters.length > 0 ? semesters[semesters.length - 1].semesterNum : 0) + 1, "REGULAR")}>
                        <Button type="submit" size="lg" className="shadow-none font-semibold w-full md:w-auto">
                            <CirclePlus className="mr-2 h-4 w-4" /> Add Semester
                        </Button>
                    </form>
                </div>
            </div>

            {semesters.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl bg-card">
                    <p className="text-muted-foreground text-lg mb-4">No semesters added yet.</p>
                </div>
            )}

            <Accordion type="multiple" className="w-full space-y-4">
                {semesters.map((sem) => (
                    <AccordionItem key={sem.id} value={sem.id} className="border border-border rounded-lg bg-card overflow-hidden shadow-none">
                        <AccordionTrigger className="hover:no-underline px-6 py-4 bg-muted/30 hover:bg-muted/60 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between w-full md:pr-4 gap-3 md:gap-0">
                                {/* Top/Left: Name + Badge */}
                                <div className="flex flex-row items-center justify-between md:justify-start gap-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                        <span className="text-lg md:text-xl font-bold text-foreground">
                                            {(() => {
                                                if (sem.type === "SUMMER") {
                                                    const regularSemsBefore = semesters.filter(s => s.type === "REGULAR" && s.semesterNum < sem.semesterNum).length;
                                                    const summerTermNum = Math.floor(regularSemsBefore / 2);
                                                    return `Summer Term ${summerTermNum || 1}`;
                                                } else {
                                                    const regularSemNum = semesters.filter(s => s.type === "REGULAR" && s.semesterNum <= sem.semesterNum).length;
                                                    return `Semester ${regularSemNum}`;
                                                }
                                            })()}
                                        </span>
                                        <span className="w-fit text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 whitespace-nowrap">
                                            {sem.courses.length} Courses
                                        </span>
                                    </div>

                                    {/* Mobile Delete Button (Top Right) */}
                                    <div
                                        role="button"
                                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10")}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm("Are you sure you want to delete this semester? All courses in it will be lost.")) {
                                                deleteSemester(sem.id)
                                            }
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* Bottom/Right: Stats + Desktop Delete */}
                                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto">
                                    <div className="flex items-center gap-3 md:gap-6 text-sm md:text-base text-muted-foreground font-medium">
                                        <span>
                                            SGPA: <span className={sem.sgpa ? "text-foreground font-bold" : ""}>{sem.sgpa ?? "N/A"}</span>
                                        </span>
                                        <span className="text-border">|</span>
                                        <span>
                                            CGPA: <span className="text-primary font-bold">
                                                {(() => {
                                                    const previousSemesters = semesters.filter(s => s.semesterNum <= sem.semesterNum)
                                                    const { cgpa } = calculateCGPA(previousSemesters, previousSemesters.length)
                                                    return cgpa
                                                })()}
                                            </span>
                                        </span>
                                    </div>

                                    {/* Desktop Delete Button */}
                                    <div
                                        role="button"
                                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden md:inline-flex h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10")}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm("Are you sure you want to delete this semester? All courses in it will be lost.")) {
                                                deleteSemester(sem.id)
                                            }
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-border pb-4">
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Course List</p>
                                    <AddCourseDialog semesterId={sem.id} />
                                </div>

                                <div className="space-y-3">
                                    {sem.courses.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-8 italic bg-muted/20 rounded-md">
                                            No courses added to this semester yet.
                                        </div>
                                    ) : (
                                        sem.courses.map((course: any) => (
                                            <div key={course.id} className="flex items-center justify-between bg-muted/30 p-4 rounded-md border border-transparent hover:border-border transition-colors group">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-foreground text-lg">{course.name}</span>
                                                        {course.excludeFromCGPA && (
                                                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded border border-destructive/20 font-medium">
                                                                Excluded
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1 font-medium">
                                                        {course.credits} Credits • Grade: <span className="text-foreground">{course.grade}</span> • {course.type}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                    onClick={() => deleteCourse(course.id, sem.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
