"use client"

import { useEffect, useState } from "react"
import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload"
import {
  Alert,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CircleAlertIcon, FileText, UploadIcon } from 'lucide-react'

export function FileUpload({
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = ".pdf",
  multiple = false,
  className,
  onFilesChange,
  simulateUpload = false,
}) {
  const [uploadFiles, setUploadFiles] = useState([])

  const [
    { isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: [],
    onFilesChange: (newFiles) => {
      const newUploadFiles = newFiles.map((file) => {
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id
        )

        if (existingFile) {
          return {
            ...existingFile,
            ...file,
          }
        } else {
          return {
            ...file,
            progress: 100,
            status: "completed",
          }
        }
      })
      setUploadFiles(newUploadFiles)
      onFilesChange?.(newFiles)
    },
  })

  const retryUpload = (fileId) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: simulateUpload ? "uploading" : "completed",
              error: undefined,
            }
          : file
      )
    )
  }

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "rounded-lg relative border border-dashed text-center transition-all duration-300 min-h-[340px] flex items-center justify-center cursor-pointer",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.05]"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={(e) => {
          if (uploadFiles.length === 0) {
            openFileDialog(e);
          }
        }}
      >
        <input {...getInputProps()} className="sr-only" />

        {uploadFiles.length > 0 ? (
          <div className="flex flex-col items-center p-8 w-full animate-in fade-in zoom-in duration-300">
            {/* Status Icon */}
            <div className="flex h-18 w-24 items-center justify-center">
              <FileText className="size-10 text-muted-foreground" />
            </div>

            <div className="space-y-3 text-center w-full max-w-sm">
              <h4 className="text-lg font-bold text-white truncate px-4">
                {uploadFiles[0].file.name}
              </h4>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-muted-foreground/60 font-mono px-3">
                  {formatBytes(uploadFiles[0].file.size)}
                </Badge>
                <div className="size-1 rounded-full bg-white/10" />
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                  Ready to Validate
                </p>
              </div>
            </div>

            {/* Error State */}
            {uploadFiles[0].status === "error" && (
              <div className="absolute inset-0 bg-red-950/40 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-2 p-4 border border-red-500/50">
                <CircleAlertIcon className="size-10 text-red-500" />
                <p className="text-xs text-red-100 text-center font-bold px-2">{uploadFiles[0].error}</p>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); retryUpload(uploadFiles[0].id); }} className="mt-2 h-8 text-[11px] border-red-500/50 hover:bg-red-500/20 text-white">
                  Retry
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-10">
            <div
              className={cn(
                "flex h-18 w-24 items-center justify-center transition-all duration-500",
                isDragging ? "bg-blue-500/20 border-blue-400 scale-110 rotate-6" : " border-white/10"
              )}
            >
              <UploadIcon  className={cn(
                  "h-10 w-10 transition-all",
                  isDragging ? "text-blue-400" : "text-muted-foreground"
                )} />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white ring-offset-black">Drag and drop or click to upload</h3>
              <p className="text-muted-foreground/60 text-sm max-w-[280px] mx-auto leading-relaxed">
                Your data is encrypted locally and never touches our servers.
              </p>
              <div className="pt-4 flex items-center justify-center gap-2">
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                   <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">
                     PDF • MAX 10MB
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Error Message */}
      {errors.length > 0 && (
        <div className="mt-6 animate-in slide-in-from-top-4 duration-500">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 py-3 px-4 rounded-xl shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-red-500/20 rounded-full">
                    <CircleAlertIcon className="size-3 text-red-500" />
                  </div>
                  <span className="text-xs font-medium text-red-200/80">{error}</span>
                </div>
              ))}
            </div>
          </Alert>
        </div>
      )}
    </div>
  )
}
