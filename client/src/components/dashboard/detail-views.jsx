"use client";

import {
  HashIcon,
  LinkIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  CalendarIcon,
   ShieldCheckIcon,
  XCircleIcon,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function CopyField({ label, value, icon: Icon = CopyIcon }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="size-3.5 text-muted-foreground/40 shrink-0" />
        <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wider font-medium shrink-0">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 min-w-0 ml-4">
        <span className="text-[13px] text-white/80 font-mono truncate max-w-[240px]">
          {value}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/6 transition-colors shrink-0"
        >
          {copied ? (
            <CheckIcon className="size-3 text-emerald-400" />
          ) : (
            <CopyIcon className="size-3 text-muted-foreground/30" />
          )}
        </button>
      </div>
    </div>
  );
}

export function QuickMetrics({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Quick Metrics</h3>

      {metrics.latestUpload && (
        <div className="mb-4 p-3 rounded-lg bg-white/2 border border-white/4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded bg-blue-500/10 flex items-center justify-center">
              <CalendarIcon className="size-3 text-blue-400/70" />
            </div>
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
              Latest Upload
            </span>
          </div>
          <p className="text-[13px] text-white/90 font-medium truncate">
            {metrics.latestUpload.title}
          </p>
          <p className="text-[10px] text-muted-foreground/40 mt-1">
            {new Date(metrics.latestUpload.uploadedAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>
        </div>
      )}

      {metrics.latestVerification && (
        <div className="p-3 rounded-lg bg-white/2 border border-white/4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheckIcon className="size-3 text-emerald-400/70" />
            </div>
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
              Latest Verification
            </span>
          </div>
          <p className="text-[13px] text-white/90 truncate">
            {metrics.latestVerification.message}
          </p>
          <p className="text-[10px] text-muted-foreground/40 mt-1">
            {new Date(metrics.latestVerification.at).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>
        </div>
      )}

      {!metrics.latestUpload && !metrics.latestVerification && (
        <div className="flex items-center justify-center py-8 text-xs text-muted-foreground/40">
          No activity yet
        </div>
      )}
    </div>
  );
}

export function DocumentDetail({ document: doc, onRevoke, isRevoking }) {
  if (!doc) return null;

  return (
    <div className="space-y-4">
      {/* Revocation Warning Banner */}
      {doc.isRevoked && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <XCircleIcon className="size-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-tight">Document Revoked</h3>
            <p className="text-xs text-red-400/60 leading-relaxed mt-0.5">
              This document was invalidated by the issuer on {new Date(doc.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}. It is no longer considered a valid proof of issuance.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="rounded-xl border border-white/6 bg-white/2 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">{doc.title}</h2>
            <p className="text-xs text-muted-foreground/50 font-mono mt-1">
              {doc.verifyId}
            </p>
          </div>
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

        {onRevoke && !doc.isRevoked && (
          <div className="mb-4 pt-4 border-t border-white/4">
            <Button
              variant="destructive"
              size="sm"
              onClick={onRevoke}
              disabled={isRevoking}
              className="h-8 rounded-lg text-[11px] font-bold uppercase tracking-widest bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20"
            >
              {isRevoking ? (
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
              ) : (
                <XCircleIcon className="size-3.5 mr-1.5" />
              )}
              {isRevoking ? "Revoking..." : "Revoke Document"}
            </Button>
          </div>
        )}

        {/* Fields */}
        <div className="space-y-0">
          <CopyField label="Verify ID" value={doc.verifyId} icon={ShieldCheckIcon} />
          <CopyField label="TX Hash" value={doc.txHash} icon={ExternalLinkIcon} />
          <CopyField label="CID" value={doc.cid} icon={LinkIcon} />
          <CopyField label="Hash" value={doc.hash} icon={HashIcon} />
        </div>
      </div>

      {/* Parties */}
      <div className="grid gap-4 md:grid-cols-2">
        {doc.issuer && (
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold mb-2">
              Issuer
            </p>
            <p className="text-sm text-white/90 font-medium">
              {doc.issuer.name}
            </p>
            <p className="text-xs text-muted-foreground/50">{doc.issuer.email}</p>
          </div>
        )}
        {doc.recipient && (
          <div className="rounded-xl border border-white/6 bg-white/2 p-4">
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold mb-2">
              Recipient
            </p>
            <p className="text-sm text-white/90 font-medium">
              {doc.recipient.name}
            </p>
            <p className="text-xs text-muted-foreground/50">
              {doc.recipient.email}
            </p>
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="rounded-xl border border-white/6 bg-white/2 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
              Issued
            </p>
            <p className="text-sm text-white/80 mt-0.5">
              {new Date(doc.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {doc.organisation && (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
                Organisation
              </p>
              <p className="text-sm text-white/80 mt-0.5">
                {doc.organisation.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
