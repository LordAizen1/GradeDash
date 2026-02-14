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
            router.replace("/")
        } else if (error === "AdapterError" || error === "CallbackRouteError" || error === "CredentialsSignin") {
            toast.error("Service Unavailable", {
                description: "Could not connect to the database. Please try again later.",
                duration: 5000,
            })
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
