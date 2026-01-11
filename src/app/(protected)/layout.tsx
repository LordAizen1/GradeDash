import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChatWidget } from "@/components/chat-widget"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    // Double check auth here just in case, though middleware handles it mostly
    if (!session?.user) redirect("/")

    return (
        <SidebarProvider>
            <AppSidebar user={session.user} />
            <main className="w-full min-h-screen bg-background text-foreground flex flex-col">
                <div className="h-12 px-2 border-b border-sidebar-border flex items-center gap-2">
                    <SidebarTrigger />
                    <div className="h-4 w-[1px] bg-sidebar-border" />
                    <span className="text-sm text-muted-foreground">Dashboard</span>
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </main>
            <ChatWidget />
        </SidebarProvider>
    )
}
