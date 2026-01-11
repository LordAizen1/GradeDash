"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, AlertCircle, GraduationCap, Award } from "lucide-react"
import type { RequirementsProgress } from "@/lib/graduation-requirements"

interface Props {
    progress: RequirementsProgress
    cgpa: number
}

export function GraduationRequirementsDisplay({ progress, cgpa }: Props) {
    // Check if categories are completed
    const isOCComplete = progress.online.earned >= progress.online.max;
    const isIPComplete = progress.independentWork.earned >= progress.independentWork.max;

    return (
        <div className="space-y-8">
            {/* Main Progress Cards - Colorful styling */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total Credits - Purple */}
                <Card className="border-none shadow-none bg-purple-600">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-purple-100 uppercase tracking-wider">
                            Total Credits
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-4xl font-bold text-white">
                            {progress.total.earned} / {progress.total.required}
                        </div>
                        <Progress value={progress.total.percentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                        <p className="text-sm text-purple-100">
                            {progress.total.required - progress.total.earned} credits remaining
                        </p>
                    </CardContent>
                </Card>

                {/* Branch Specific Electives Card */}
                {progress.disciplineElectives ? (
                    <Card className="border-none shadow-none bg-blue-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
                                Discipline Electives
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-4xl font-bold text-white">
                                {progress.disciplineElectives.earned} / {progress.disciplineElectives.required}
                            </div>
                            <Progress value={progress.disciplineElectives.percentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                            {progress.disciplineElectives.details && (
                                <div className="text-xs text-blue-100 flex gap-3 font-medium">
                                    <span>CSE: {progress.disciplineElectives.details.cseEarned}</span>
                                    {progress.disciplineElectives.details.mathEarned !== undefined && <span>Math: {progress.disciplineElectives.details.mathEarned}</span>}
                                    {progress.disciplineElectives.details.bioEarned !== undefined && <span>Bio: {progress.disciplineElectives.details.bioEarned}</span>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : progress.eceElectives ? (
                    <Card className="border-none shadow-none bg-blue-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
                                ECE Electives (3xx+)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-4xl font-bold text-white">
                                {progress.eceElectives.earned} / {progress.eceElectives.required}
                            </div>
                            <Progress value={progress.eceElectives.percentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                            <p className="text-sm text-blue-100">
                                Non-core, excludes BTP/IP
                            </p>
                        </CardContent>
                    </Card>
                ) : progress.cseElectives ? (
                    <Card className="border-none shadow-none bg-blue-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
                                CSE Electives (3xx+)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-4xl font-bold text-white">
                                {progress.cseElectives.earned} / {progress.cseElectives.required}
                            </div>
                            <Progress value={progress.cseElectives.percentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                            <p className="text-sm text-blue-100">
                                Non-core, excludes BTP/IP
                            </p>
                        </CardContent>
                    </Card>
                ) : null}

                {/* SSH Credits - Orange */}
                <Card className="border-none shadow-none bg-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-orange-100 uppercase tracking-wider">
                            SSH Credits
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-4xl font-bold text-white">
                            {progress.ssh.earned} / {progress.ssh.required}
                        </div>
                        <Progress value={progress.ssh.percentage} className="h-2 bg-white/30 [&>div]:bg-white" />
                        <p className="text-sm text-orange-100">
                            Social Sciences & Humanities
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Secondary Requirements */}
            <div className="grid gap-4 md:grid-cols-4">
                {/* SG */}
                <Card className={`border-none shadow-none ${progress.sg.completed ? 'bg-green-600' : 'bg-muted'}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                        {progress.sg.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                            <XCircle className="h-6 w-6 text-muted-foreground" />
                        )}
                        <div>
                            <p className={`font-semibold ${progress.sg.completed ? 'text-white' : 'text-foreground'}`}>
                                Self Growth
                            </p>
                            <p className={`text-sm ${progress.sg.completed ? 'text-green-100' : 'text-muted-foreground'}`}>
                                {progress.sg.earned} / {progress.sg.required} credits
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* CW */}
                <Card className={`border-none shadow-none ${progress.cw.completed ? 'bg-green-600' : 'bg-muted'}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                        {progress.cw.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                            <XCircle className="h-6 w-6 text-muted-foreground" />
                        )}
                        <div>
                            <p className={`font-semibold ${progress.cw.completed ? 'text-white' : 'text-foreground'}`}>
                                Community Work
                            </p>
                            <p className={`text-sm ${progress.cw.completed ? 'text-green-100' : 'text-muted-foreground'}`}>
                                {progress.cw.earned} / {progress.cw.required} credits
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Online Courses */}
                <Card className={`border-none shadow-none ${!progress.online.withinLimit ? 'bg-destructive' : isOCComplete ? 'bg-green-600' : 'bg-muted'}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                        {!progress.online.withinLimit ? (
                            <AlertCircle className="h-6 w-6 text-white" />
                        ) : isOCComplete ? (
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                        )}
                        <div>
                            <p className={`font-semibold ${!progress.online.withinLimit ? 'text-white' : isOCComplete ? 'text-white' : 'text-foreground'}`}>
                                Online Courses
                            </p>
                            <p className={`text-sm ${!progress.online.withinLimit ? 'text-red-100' : isOCComplete ? 'text-green-100' : 'text-muted-foreground'}`}>
                                {progress.online.earned} / {progress.online.max} max
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Independent Work */}
                <Card className={`border-none shadow-none ${!progress.independentWork.withinLimit ? 'bg-destructive' : isIPComplete ? 'bg-green-600' : 'bg-muted'}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                        {!progress.independentWork.withinLimit ? (
                            <AlertCircle className="h-6 w-6 text-white" />
                        ) : isIPComplete ? (
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                        )}
                        <div>
                            <p className={`font-semibold ${!progress.independentWork.withinLimit ? 'text-white' : isIPComplete ? 'text-white' : 'text-foreground'}`}>
                                IP/IS/UR
                            </p>
                            <p className={`text-sm ${!progress.independentWork.withinLimit ? 'text-red-100' : isIPComplete ? 'text-green-100' : 'text-muted-foreground'}`}>
                                {progress.independentWork.earned} / {progress.independentWork.max} max
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Honors Eligibility */}
            <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-none shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Award className="h-6 w-6" />
                        Honors Eligibility
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        {/* Credits Check */}
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                            {progress.honors.hasEnoughCredits ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                                <XCircle className="h-5 w-5 text-white/60" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-white">168 Credits</p>
                                <p className="text-xs text-white/80">
                                    {progress.honors.currentCredits} earned ({progress.honors.requiredCredits - progress.honors.currentCredits} needed)
                                </p>
                            </div>
                        </div>

                        {/* BTP Check */}
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                            {progress.honors.hasBTP ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                                <XCircle className="h-5 w-5 text-white/60" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-white">B.Tech Project</p>
                                <p className="text-xs text-white/80">
                                    {progress.btp.earned > 0 ? `${progress.btp.earned} credits` : 'Not started'}
                                </p>
                            </div>
                        </div>

                        {/* CGPA Check */}
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                            {progress.honors.hasCgpa ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                                <XCircle className="h-5 w-5 text-white/60" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-white">CGPA ≥ 8.0</p>
                                <p className="text-xs text-white/80">
                                    Current: {cgpa.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {progress.honors.eligible && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <GraduationCap className="h-6 w-6 text-white" />
                            <span className="text-lg font-bold text-white">
                                You are eligible for Honors! 🎉
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

