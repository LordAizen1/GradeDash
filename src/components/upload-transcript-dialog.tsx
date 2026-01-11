"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CloudUpload, FileText } from "lucide-react"
import { uploadTranscript } from "@/app/actions/transcript-actions"

export function UploadTranscriptDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const formData = new FormData(event.currentTarget)

        setStatus("Extracting text and processing with AI...")
        const result = await uploadTranscript(formData)

        setIsLoading(false)
        setStatus(null)

        if (result.success) {
            setOpen(false)
            setSelectedFile(null)
            alert(result.message)
        } else {
            setMessage(result.error as string)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null
        setSelectedFile(file)
        setMessage(null)
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) {
                setSelectedFile(null)
                setMessage(null)
                setStatus(null)
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="shadow-none font-semibold">
                    <CloudUpload className="mr-2 h-4 w-4" /> Upload Transcript
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Transcript</DialogTitle>
                    <DialogDescription>
                        Upload your IIITD transcript as a PDF file. We'll extract course codes, names, credits, and grades automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="transcript">Transcript (PDF only)</Label>
                        <Input
                            id="transcript"
                            name="file"
                            type="file"
                            accept=".pdf"
                            required
                            onChange={handleFileChange}
                        />
                        {selectedFile && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>{selectedFile.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                        <p className="font-medium mb-1">Tips for best results:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Use the official text-based PDF from ERP</li>
                            <li>Scanned/image PDFs won't work</li>
                            <li>All semesters will be imported</li>
                        </ul>
                    </div>

                    {status && (
                        <p className="text-sm text-blue-600 animate-pulse font-medium">{status}</p>
                    )}

                    {message && (
                        <p className="text-sm text-red-500 font-medium">{message}</p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading || !selectedFile}>
                            {isLoading ? "Processing..." : "Import Transcript"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
