import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "Guest",
            credentials: {},
            async authorize(credentials) {
                try {
                    const guestUser = await prisma.user.upsert({
                        where: { email: "guest@grade-dash.demo" },
                        update: {},
                        create: {
                            email: "guest@grade-dash.demo",
                            name: "Guest Student",
                            image: "",
                            batch: 2024,
                            branch: "CSE",
                            currentSem: 6,
                        }
                    })
                    return guestUser
                } catch {
                    // DB is down — reject the login attempt gracefully
                    return null
                }
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user }) {
            // Allow IIITD emails OR the specific Guest email
            if (user.email && (user.email.endsWith("@iiitd.ac.in") || user.email === "guest@grade-dash.demo")) {
                return true
            }
            return "/?error=InvalidDomain"
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.batch = user.batch ?? null
                token.branch = user.branch ?? null
                token.currentSem = user.currentSem ?? null
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string
                session.user.batch = token.batch as number
                session.user.branch = token.branch as string
                session.user.currentSem = token.currentSem as number
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
})
