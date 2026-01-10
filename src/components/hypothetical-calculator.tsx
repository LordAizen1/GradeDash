"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface CalculatorProps {
    currentCGPA: number
    currentCredits: number
    totalCreditsRequired: number
}

export function HypotheticalCalculator({ currentCGPA, currentCredits, totalCreditsRequired = 156 }: CalculatorProps) {
    // Scenario 1 State
    const [targetCGPA, setTargetCGPA] = useState<string>("")
    const [userCGPA, setUserCGPA] = useState<string>(currentCGPA.toString())
    const [userCredits, setUserCredits] = useState<string>(currentCredits.toString())
    const [requiredSGPA, setRequiredSGPA] = useState<number | null>(null)

    // Scenario 2 State
    const [futureSGPA, setFutureSGPA] = useState<string>("")
    const [futureCredits, setFutureCredits] = useState<string>("20")
    const [predictedResult, setPredictedResult] = useState<{ cgpa: number, gain: number } | null>(null)

    const calculateLegacyPrediction = () => {
        // ... (Scenario 1 logic unchanged) ...
        const target = parseFloat(targetCGPA)
        const current = parseFloat(userCGPA)
        const credits = parseFloat(userCredits)

        if (isNaN(target) || target > 10 || target < 0) return
        if (isNaN(current) || isNaN(credits)) return

        // Formula: (Target * Total - Current * CurrentCredits) / Remaining
        const remainingCredits = totalCreditsRequired - credits
        if (remainingCredits <= 0) return

        const totalPointsNeeded = target * totalCreditsRequired
        const currentPoints = current * credits

        const remainingPointsNeeded = totalPointsNeeded - currentPoints
        const req = remainingPointsNeeded / remainingCredits

        setRequiredSGPA(parseFloat(req.toFixed(2)))
    }

    const calculatePrediction = () => {
        const sgpa = parseFloat(futureSGPA)
        const fCredits = parseFloat(futureCredits)
        const current = parseFloat(userCGPA)
        const cCredits = parseFloat(userCredits)

        if (isNaN(sgpa) || isNaN(fCredits) || isNaN(current) || isNaN(cCredits)) return

        const currentPoints = current * cCredits
        const futurePoints = sgpa * fCredits
        const totalPoints = currentPoints + futurePoints
        const totalCredits = cCredits + fCredits

        const newCGPA = totalPoints / totalCredits
        const gain = newCGPA - current

        setPredictedResult({
            cgpa: parseFloat(newCGPA.toFixed(2)),
            gain: parseFloat(gain.toFixed(2))
        })
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 bg-muted/20 p-6 rounded-xl border border-border">
            <Card className="shadow-none border-border bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-xl">Scenario 1: Target CGPA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Current Status (Editable)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="current-cgpa" className="text-xs text-muted-foreground">Current CGPA</Label>
                                <Input
                                    id="current-cgpa"
                                    type="number"
                                    step="0.01"
                                    value={userCGPA}
                                    onChange={(e) => setUserCGPA(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="current-credits" className="text-xs text-muted-foreground">Credits Earned</Label>
                                <Input
                                    id="current-credits"
                                    type="number"
                                    value={userCredits}
                                    onChange={(e) => setUserCredits(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-1.5">
                            <Label htmlFor="target" className="text-xs text-muted-foreground">Target CGPA Goal</Label>
                            <Input
                                id="target"
                                type="number"
                                step="0.01"
                                max="10"
                                value={targetCGPA}
                                onChange={(e) => setTargetCGPA(e.target.value)}
                                placeholder="e.g. 8.5"
                                className="bg-background"
                            />
                        </div>
                        <Button onClick={calculateLegacyPrediction} variant="secondary" className="w-full shadow-none font-semibold">
                            Calculate Requirement
                        </Button>
                    </div>

                    {requiredSGPA !== null && (
                        <div className={`p-4 rounded-lg bg-background border border-border animate-in fade-in slide-in-from-bottom-2`}>
                            <div className="flex flex-col items-center justify-center text-center space-y-1">
                                <span className="text-sm text-muted-foreground">Required SGPA (Average)</span>
                                {requiredSGPA > 10 ? (
                                    <>
                                        <span className="text-4xl font-bold tracking-tight text-destructive">
                                            {requiredSGPA}
                                        </span>
                                        <span className="text-xs font-medium text-destructive">
                                            Impossible (&gt; 10)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-4xl font-bold tracking-tight text-primary">
                                            {requiredSGPA}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Maintain this for remaining semesters
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-none border-border bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-xl">Scenario 2: Future Predictor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Hypothetical Performance</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="future-sgpa" className="text-xs text-muted-foreground">Expected SGPA</Label>
                                <Input
                                    id="future-sgpa"
                                    type="number"
                                    step="0.01"
                                    max="10"
                                    placeholder="9.0"
                                    value={futureSGPA}
                                    onChange={(e) => setFutureSGPA(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="future-credits" className="text-xs text-muted-foreground">Credits</Label>
                                <Input
                                    id="future-credits"
                                    type="number"
                                    placeholder="20"
                                    value={futureCredits}
                                    onChange={(e) => setFutureCredits(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                        </div>
                        <Button onClick={calculatePrediction} variant="secondary" className="w-full shadow-none font-semibold">
                            Predict New CGPA
                        </Button>
                    </div>

                    {predictedResult && (
                        <div className="p-4 rounded-lg bg-background border border-border animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex flex-col items-center justify-center text-center space-y-1">
                                <span className="text-sm text-muted-foreground">Projected CGPA</span>
                                <span className="text-4xl font-bold tracking-tight text-primary">
                                    {predictedResult.cgpa}
                                </span>
                                <span className={`text-xs font-medium ${predictedResult.gain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {predictedResult.gain >= 0 ? '▲' : '▼'} {Math.abs(predictedResult.gain)} change
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="md:col-span-2 mt-4 p-4 md:p-6 bg-muted/40 rounded-xl border border-border">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How it Works
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    <li>
                        <strong>Graded Credits Only:</strong> When entering "Credits Earned" or "Future Credits", <strong>exclude</strong> non-graded credits like Sports (SG), or Community Work (CW) or courses with 'S' (Satisfactory) or 'X' (Exempt) grades. These do not affect your CGPA.
                    </li>
                    <li>
                        <strong>Weighted Average:</strong> The calculator uses the standard formula: <code className="bg-muted px-1 py-0.5 rounded text-xs ml-1">((Current_CGPA × Past_Credits) + (New_SGPA × New_Credits)) ÷ Total_Credits</code>.
                    </li>
                    <li>
                        <strong>Accuracy:</strong> The prediction is only as accurate as your inputs. Ensure your "Credits Earned" matches your transcript's <em>graded</em> credit count, not necessarily the total registered credits.
                    </li>
                </ul>
            </div>
        </div>
    )
}
