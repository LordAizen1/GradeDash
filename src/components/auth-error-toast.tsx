"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

function AuthErrorToastContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const error = searchParams.get("error")
        if (error === "InvalidDomain") {
            toast.error("Access Denied", {
                description: "Only @iiitd.ac.in emails are allowed.",
                duration: 5000,
            })
            // Clean up the URL
            router.replace("/")
        }
    }, [searchParams, router])

    return null
}

export function AuthErrorToast() {
    return (
        <Suspense>
            <AuthErrorToastContent />
        </Suspense>
    )
}
