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
                // Upsert Guest User to ensure it exists
                const guestUser = await prisma.user.upsert({
                    where: { email: "guest@grade-dash.demo" },
                    update: {}, // No updates needed, just ensure existence
                    create: {
                        email: "guest@grade-dash.demo",
                        name: "Guest Student",
                        image: "", // Optional: specific guest avatar
                        batch: 2024,
                        branch: "CSE", // Default branch
                        currentSem: 6, // Default sem
                    }
                })
                return guestUser
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
        async jwt({ token, user, trigger, session }) {
            // Initial sign in or update
            if (user) {
                token.id = user.id
                // @ts-ignore
                token.batch = user.batch
                // @ts-ignore
                token.branch = user.branch
                // @ts-ignore
                token.currentSem = user.currentSem
            }
            return token
        },
        // @ts-ignore
        async session({ session, token }) {
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.id as string
                // @ts-ignore
                session.user.batch = token.batch as number
                // @ts-ignore
                session.user.branch = token.branch as string
                // @ts-ignore
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
