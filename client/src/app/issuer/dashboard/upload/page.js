"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useSessionStore } from "@/store/useSessionStore";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  LayoutDashboardIcon,
  FileTextIcon,
  ActivityIcon,
  BarChart3Icon,
  UploadIcon,
  LifeBuoyIcon,
  SendIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function IssuerUploadPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const setSession = useSessionStore((s) => s.setSession);

  const [files, setFiles] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [metadata, setMetadata] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || session.role !== "admin") {
        router.replace("/issuer/login");
      }
    }
    if (!sessionLoading && session) {
      setSession(session);
    }
  }, [sessionLoading, session, router, setSession]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || session.role !== "admin") return null;

  const sidebarData = {
    navMain: [
      { title: "Dashboard", url: "/issuer/dashboard", icon: <LayoutDashboardIcon /> },
      { title: "Documents", url: "/issuer/dashboard/documents", icon: <FileTextIcon /> },
      { title: "Upload", url: "/issuer/dashboard/upload", icon: <UploadIcon />, isActive: true },
      { title: "Activity", url: "/issuer/dashboard/activity", icon: <ActivityIcon /> },
      { title: "Analytics", url: "/issuer/dashboard/analytics", icon: <BarChart3Icon /> },
    ],
    navSecondary: [
      { title: "Support", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Feedback", url: "#", icon: <SendIcon /> },
    ],
    projects: [],
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setUploadStatus({ type: "error", message: "Please select a file to upload." });
      return;
    }
    if (!recipientEmail) {
      setUploadStatus({ type: "error", message: "Recipient email is required." });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", files[0].file);
    formData.append("recipientEmail", recipientEmail);
    if (metadata) {
      formData.append("metadata", metadata);
    }

    try {
      const response = await fetch("/api/document/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to upload document");
      }

      setUploadStatus({
        type: "success",
        message: "Document successfully uploaded and issued to recipient.",
      });
      
      // Reset form on success
      setFiles([]);
      setRecipientEmail("");
      setMetadata("");
      setUploadKey(prev => prev + 1);
      
      // Redirect to documents list after short delay
      setTimeout(() => {
        router.push("/issuer/dashboard/documents");
      }, 2000);

    } catch (err) {
      setUploadStatus({ type: "error", message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setRecipientEmail("");
    setMetadata("");
    setUploadStatus(null);
    setUploadKey(prev => prev + 1);
  };

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar data={sidebarData} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6 md:p-10 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Issue New Document</h1>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Securely upload and issue verifiable documents to recipients.
                </p>
              </div>

              {uploadStatus && (
                <div className={`p-4 rounded-xl border flex gap-3 text-sm font-medium ${
                  uploadStatus.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {uploadStatus.type === 'success' ? (
                    <CheckCircleIcon className="size-5 shrink-0" />
                  ) : (
                    <AlertCircleIcon className="size-5 shrink-0" />
                  )}
                  <p>{uploadStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Recipient Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="recipient@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        className="bg-white/[0.02] border-white/[0.08] focus-visible:border-white/[0.2] h-11"
                        disabled={isUploading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metadata" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Document Metadata (Optional)
                      </Label>
                      <Textarea
                        id="metadata"
                        placeholder='{"documentType": "Certificate", "issueDate": "2024"}'
                        value={metadata}
                        onChange={(e) => setMetadata(e.target.value)}
                        className="bg-white/[0.02] border-white/[0.08] focus-visible:border-white/[0.2] min-h-[120px] font-mono text-xs"
                        disabled={isUploading}
                      />
                      <p className="text-[10px] text-muted-foreground/40 mt-1">
                        Optional JSON metadata to associate with this document.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                      Document File <span className="text-red-400">*</span>
                    </Label>
                    <FileUpload
                      key={uploadKey}
                      maxFiles={1}
                      accept=".pdf"
                      maxSize={5 * 1024 * 1024}
                      onFilesChange={setFiles}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/[0.06]">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleReset}
                    disabled={isUploading}
                    className="h-11 px-6 rounded-full text-muted-foreground hover:text-white hover:bg-white/5"
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading || files.length === 0 || !recipientEmail}
                    className="h-11 px-8 rounded-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Issuing Document...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Issue Document
                      </>
                    )}
                  </Button>
                </div>
              </form>

            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
