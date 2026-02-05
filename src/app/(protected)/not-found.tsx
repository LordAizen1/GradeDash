import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserX } from "lucide-react"

export default function ProtectedNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-none shadow-none bg-muted/50">
                <CardContent className="flex flex-col items-center text-center py-12 space-y-4">
                    <div className="bg-destructive/10 p-4 rounded-full">
                        <UserX className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">User not found</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Your account may have been removed or your session has expired. Please sign in again.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="mt-2">
                            Return to Home
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
