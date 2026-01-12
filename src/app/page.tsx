import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/submit-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Sparkles, GraduationCap, TrendingUp, ArrowRight } from "lucide-react"
import { AuthErrorToast } from "@/components/auth-error-toast"

export default async function Home() {
  const session = await auth()

  if (session?.user?.id) {
    const { prisma } = await import("@/lib/prisma")
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (dbUser) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center overflow-hidden">
      <AuthErrorToast />
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        <GridPattern
          width={50}
          height={50}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className="[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] opacity-40 dark:opacity-20"
        />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 dark:opacity-20" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen opacity-50 dark:opacity-20" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left: Hero Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="h-4 w-4 fill-current" />
            <span>The Smartest Way to Track Grades</span>
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground text-balance leading-[1.1]">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Academic Journey</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-balance leading-relaxed">
              Effortlessly track semesters, predict your future CGPA, and analyze credit trends. Built for students who demand precision and aesthetics.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>GPA Predictor</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Transcript Import</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Insights</span>
            </div>
          </div>
        </div>

        {/* Right: Modern Login Card */}
        <div className="w-full flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <Card className="w-full max-w-[420px] border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Hover Gradient Effect */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="text-center space-y-3 pb-8 pt-8">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Access Dashboard</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Sign in with your institute account
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <form
                action={async () => {
                  "use server"
                  await signIn("google", { redirectTo: "/dashboard" })
                }}
              >
                <SubmitButton pendingText="Signing in..." className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group/btn" size="lg">
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                  <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                </SubmitButton>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <form
                action={async () => {
                  "use server"
                  await signIn("credentials", { redirectTo: "/dashboard" })
                }}
              >
                <Button variant="outline" className="w-full h-12 text-base font-medium border-border dark:border-white/20 hover:bg-accent hover:text-foreground transition-colors group/guest" size="lg">
                  Login as Guest
                  <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover/guest:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-muted-foreground opacity-50">
        © {new Date().getFullYear()} GradeDash. Built for Students by <a href="https://github.com/LordAizen1" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Md Kaif</a>.
      </div>
    </div>
  )
}
