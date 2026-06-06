"use client";

import { Badge } from "@/components/ui/badge";
import {
  FileTextIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { useState } from "react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/6 transition-colors"
      title="Copy"
    >
      {copied ? (
        <CheckIcon className="size-3 text-emerald-400" />
      ) : (
        <CopyIcon className="size-3 text-muted-foreground/40" />
      )}
    </button>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DocumentsTable({
  documents = [],
  role = "admin",
  onDocumentClick,
}) {
  if (!documents.length) {
    return (
      <div className="rounded-xl border border-white/6 bg-white/2 p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-white/4 flex items-center justify-center mb-3">
            <FileTextIcon className="size-5 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/50 font-medium">
            No documents found
          </p>
          <p className="text-xs text-muted-foreground/30 mt-1">
            Documents will appear here once uploaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-white/4 bg-white/2">
        <div className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Document
        </div>
        <div className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          {role === "admin" ? "Recipient" : "Issuer"}
        </div>
        <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Status
        </div>
        <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Date
        </div>
        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          TX
        </div>
      </div>

      {/* Table Rows */}
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onDocumentClick?.(doc.id)}
          className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/3 last:border-0 transition-colors hover:bg-white/3 cursor-pointer group"
        >
          {/* Document title + verifyId */}
          <div className="col-span-4 flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/4 border border-white/6">
              <FileTextIcon className="size-3.5 text-muted-foreground/60" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white/90 truncate">
                {doc.title}
              </p>
              <div className="flex items-center gap-1">
                <p className="text-[10px] text-muted-foreground/40 font-mono truncate">
                  {doc.verifyId}
                </p>
                <CopyButton text={doc.verifyId} />
              </div>
            </div>
          </div>

          {/* Recipient / Issuer */}
          <div className="col-span-3 flex items-center min-w-0">
            <div className="min-w-0">
              <p className="text-[13px] text-white/70 truncate">
                {role === "admin"
                  ? doc.recipient?.name || "—"
                  : doc.issuer?.name || "—"}
              </p>
              <p className="text-[10px] text-muted-foreground/40 truncate">
                {role === "admin"
                  ? doc.recipient?.email || ""
                  : doc.issuer?.email || ""}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2 flex items-center">
            <Badge
              variant="outline"
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 ${
                doc.isRevoked
                  ? "border-red-500/20 text-red-400/80 bg-red-500/5"
                  : "border-emerald-500/20 text-emerald-400/80 bg-emerald-500/5"
              }`}
            >
              {doc.isRevoked ? "Revoked" : "Active"}
            </Badge>
          </div>

          {/* Date */}
          <div className="col-span-2 flex items-center">
            <p className="text-[12px] text-muted-foreground/50">
              {formatDate(doc.createdAt)}
            </p>
          </div>

          {/* TX Link */}
          <div className="col-span-1 flex items-center">
            {doc.txHash && (
              <a
                href={`https://amoy.polygonscan.com/tx/${doc.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-md hover:bg-white/6 transition-colors opacity-0 group-hover:opacity-100"
                title="View on Polygonscan"
              >
                <ExternalLinkIcon className="size-3.5 text-muted-foreground/40" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
