"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addCourse } from "@/app/actions/semester-actions"
import { useState } from "react"
import { CirclePlus } from "lucide-react"

import { toast } from "sonner"

export function AddCourseDialog({ semesterId, isGuest = false }: { semesterId: string, isGuest?: boolean }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                        if (isGuest) {
                            e.preventDefault()
                            toast.error("Guest users cannot add courses.")
                        }
                    }}
                >
                    <CirclePlus className="h-4 w-4" /> Add Course
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>Add Course</DialogTitle>
                    <DialogDescription>
                        Add a course to this semester.
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        await addCourse(semesterId, formData)
                        setOpen(false)
                    }}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" className="col-span-3 bg-zinc-800 border-zinc-700" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="credits" className="text-right">Credits</Label>
                        <Select name="credits" defaultValue="4">
                            <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="grade" className="text-right">Grade</Label>
                        <Select name="grade" defaultValue="A">
                            <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {["A+", "A", "A-", "B", "B-", "C", "C-", "D", "F", "S", "X"].map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select name="type" defaultValue="Mandatory (Core)">
                            <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mandatory (Core)">Mandatory (Core)</SelectItem>
                                <SelectItem value="Elective">Elective</SelectItem>
                                <SelectItem value="SSH">SSH</SelectItem>
                                <SelectItem value="Repeated">Repeated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save Course</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
