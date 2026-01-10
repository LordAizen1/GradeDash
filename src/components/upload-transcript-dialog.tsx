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
import { Checkbox } from "@/components/ui/checkbox"
import { CloudUpload } from "lucide-react"
import { uploadTranscript } from "@/app/actions/transcript-actions"

export function UploadTranscriptDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [conversionStatus, setConversionStatus] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setMessage(null)
        setConversionStatus(null)

        const formData = new FormData(event.currentTarget)
        const file = formData.get('file') as File

        // Handle PDF conversion client-side
        if (file && file.type === 'application/pdf') {
            try {
                setConversionStatus("Converting PDF to images for better accuracy...")

                // Dynamically import pdfjs
                const pdfjs = await import('pdfjs-dist');
                // Set worker using CDN to avoid build issues
                pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

                const imageBlobs: Blob[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    setConversionStatus(`Processing page ${i} of ${pdf.numPages}...`);
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 }); // High quality scale

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        await page.render({ canvasContext: context, viewport: viewport } as any).promise;

                        const blob = await new Promise<Blob | null>(resolve =>
                            canvas.toBlob(resolve, 'image/jpeg', 0.95)
                        );

                        if (blob) imageBlobs.push(blob);
                    }
                }

                if (imageBlobs.length > 0) {
                    // Replace the PDF with all generated images
                    formData.delete('file');
                    imageBlobs.forEach((blob, index) => {
                        formData.append('files', blob, `page-${index + 1}.jpg`);
                    });
                }

            } catch (error) {
                console.error("PDF Conversion failed:", error);
                setMessage("Failed to convert PDF. Please try uploading images directly.");
                setIsLoading(false);
                return;
            }
        } else if (file) {
            formData.delete('file');
            formData.append('files', file);
        }

        setConversionStatus("Analyzing transcript with AI...")
        const result = await uploadTranscript(formData)

        setIsLoading(false)
        setConversionStatus(null)

        if (result.success) {
            setOpen(false)
            alert(result.message)
        } else {
            setMessage(result.error as string)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="shadow-none font-semibold">
                    <CloudUpload className="mr-2 h-4 w-4" /> Upload Transcript
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Transcript</DialogTitle>
                    <DialogDescription>
                        Upload your full transcript (PDF or Images). We'll process all pages automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="transcript">Transcript (PDF or Images)</Label>
                        <Input id="transcript" name="file" type="file" accept=".pdf, .png, .jpg, .jpeg" required />
                    </div>

                    {conversionStatus && (
                        <p className="text-sm text-blue-600 animate-pulse font-medium">{conversionStatus}</p>
                    )}

                    {message && (
                        <p className="text-sm text-red-500 font-medium">{message}</p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Import Transcript"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
