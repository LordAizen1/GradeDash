"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { completeOnboarding } from "@/app/actions"

export function OnboardingForm() {
    return (
        <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900 text-zinc-100">
            <CardHeader>
                <CardTitle>Academic Profile</CardTitle>
                <CardDescription className="text-zinc-400">
                    Tell us about your batch and branch to get started.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={completeOnboarding} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="batch">Batch (Joining Year)</Label>
                        <Select name="batch" required>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                <SelectValue placeholder="Select Joining Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {[2022, 2023, 2024, 2025, 2026].map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select name="branch" required>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                <SelectValue placeholder="Select Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {["CSE", "ECE", "CSAM", "CSD", "CSSS", "CSB", "CSAI"].map(
                                    (branch) => (
                                        <SelectItem key={branch} value={branch}>
                                            {branch}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currentSem">Current Semester</Label>
                        <Select name="currentSem" required>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                <SelectValue placeholder="Select Semester (e.g. 1-8)" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                    <SelectItem key={sem} value={sem.toString()}>
                                        Semester {sem}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                        Continue to Dashboard
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
