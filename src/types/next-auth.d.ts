import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            batch: number | null
            branch: string | null
            currentSem: number | null
        } & DefaultSession["user"]
    }

    interface User {
        batch?: number | null
        branch?: string | null
        currentSem?: number | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        batch?: number | null
        branch?: string | null
        currentSem?: number | null
    }
}
