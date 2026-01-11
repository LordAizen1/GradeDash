"use client"

import { useAssistant } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { status, messages, input, submitMessage, handleInputChange } = useAssistant({
        api: '/api/chat',
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, status]);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] md:w-[400px] h-[500px] flex flex-col py-0 gap-0 shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <CardHeader className="bg-primary px-3 py-2.5 flex flex-row items-center justify-between space-y-0 rounded-t-xl shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Bot className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-base text-primary-foreground">GradeDash Guide</CardTitle>
                                <p className="text-xs text-primary-foreground/80">Ask about B.Tech Regulations</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={toggleOpen} className="text-primary-foreground hover:bg-white/20 h-8 w-8">
                            <X className="h-5 w-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-background">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-4" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                                    <Bot className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">Hi! I can help you understand IIITD regulations or specific branch requirements.</p>
                                </div>
                            )}
                            {messages.map((m) => (
                                <div key={m.id} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                    <div className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                        m.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none"
                                    )}>
                                        {/* Simple formatting for now */}
                                        <div className="whitespace-pre-wrap leading-relaxed">{m.content.replace(/【.*?】/g, '')}</div>
                                    </div>
                                </div>
                            ))}
                            {status === 'in_progress' && (
                                <div className="flex gap-2 items-center text-muted-foreground text-xs pl-2">
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-2 border-t bg-background/50 backdrop-blur-sm shrink-0">
                            <form onSubmit={submitMessage} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask a question..."
                                    className="flex-1"
                                    disabled={status === 'in_progress'}
                                />
                                <Button type="submit" size="icon" disabled={status === 'in_progress' || !input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={toggleOpen}
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary text-primary-foreground"
                >
                    <MessageCircle className="h-7 w-7" />
                </Button>
            )}
        </div>
    );
}
