"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ShieldCheck, Database, Link2, Calendar, User, FileText, LoaderCircle, AlertCircle } from "lucide-react";

export default function VerifyPage() {
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  
  const refs = {
    glow: useRef(null),
    container: useRef(null),
    results: useRef(null),
    error: useRef(null),
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(refs.glow.current, {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      });

      gsap.from(refs.container.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  const handleValidate = () => {
    setIsVerifying(true);
    setIsVerified(false);
    setIsInvalid(false);

    // Simulating verification delay
    setTimeout(() => {
      setIsVerifying(false);
      
      const success = Math.random() > 0.5;
      
      if (success) {
        setIsVerified(true);
        gsap.from(refs.results.current, {
          opacity: 0,
          x: 20,
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        setIsInvalid(true);
        gsap.from(refs.error.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
    }, 2000);
  };

  const handleReset = () => {
    setIsVerified(false);
    setIsInvalid(false);
    setIsVerifying(false);
    setHasFile(false);
    setResetKey(prev => prev + 1);
  };

  const fileData = {
    title: "Deed of Trust - EtherVault #082",
    hash: "0x8a38ec0...a05501",
    issuedTo: "Atharva Bakale (atharvab@gmail.com)",
    issuedBy: "EtherVault Authority",
    date: "10/9/2026",
    network: "Polygon Amoy",
    verificationId: "4ecf6s1t"
  };

  return (
    <section className="relative z-0 min-h-screen flex items-center justify-center px-6 py-20 text-center overflow-hidden">
      <div className="pointer-events-none absolute z-1 inset-0">
        <div
          ref={refs.glow}
          className="absolute bottom-0 left-1/2 w-full h-[80vh] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-white/5 blur-[120px] will-change-[transform,opacity]"
        />
      </div>

      <div 
        ref={refs.container}
        className="relative z-20 w-full max-w-6xl flex flex-col gap-12"
      >
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Certificate Validator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cross-reference cryptographic hashes against our secure blockchain database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Upload Section */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
            <div className="text-left space-y-2">
              <h2 className="text-2xl font-semibold text-white">Upload Certificate</h2>
              <p className="text-muted-foreground text-sm">Upload the document fragment you wish to validate.</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <FileUpload 
                key={resetKey}
                className="w-full"
                maxFiles={1}
                accept=".pdf"
                onFilesChange={(files) => setHasFile(files.length > 0)}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleValidate} 
                disabled={!hasFile || isVerifying || (isVerified || isInvalid)}
                className="flex-1 py-6 text-lg font-semibold bg-white hover:bg-white/60 text-black border-0 disabled:bg-white/10 disabled:text-white/20"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin size-5" /> Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-5" /> Validate Certificate
                  </span>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="px-8 py-6 border-white/10 hover:bg-white/5 text-white"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Right Column: Skeleton */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-5 text-left pb-4 border-b border-white/5">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500",
                !isVerified && !isInvalid && !isVerifying ? "border-dashed border-white/20 bg-white/5" : 
                isVerifying ? "border-blue-500/50 bg-blue-500/10 animate-pulse" : 
                isInvalid ? "border-red-500/50 bg-red-500/10" :
                "border-green-500/50 bg-green-500/10"
              )}>
                {!isVerified && !isInvalid && !isVerifying ? (
                  <ShieldCheck className="size-6 text-white/20" />
                ) : isVerifying ? (
                  <LoaderCircle className="size-6 text-blue-500 animate-spin" />
                ) : isInvalid ? (
                  <AlertCircle className="size-6 text-red-500" />
                ) : (
                  <CheckCircle2 className="size-6 text-green-500" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className={cn(
                  "text-2xl font-semibold transition-colors duration-500",
                  !isVerified && !isInvalid && !isVerifying ? "text-white/40" : 
                  isVerifying ? "text-blue-400" : 
                  isInvalid ? "text-red-400" :
                  "text-green-400"
                )}>
                  {!isVerified && !isInvalid && !isVerifying ? "Ready to Validate" : 
                   isVerifying ? "Verifying..." : 
                   isInvalid ? "Certificate Invalid" :
                   "Certificate Valid"}
                </h3>
                <p className="text-muted-foreground/60 text-sm">
                  {!isVerified && !isInvalid && !isVerifying ? "Upload your certificate to see verification details" : 
                   isVerifying ? "Searching cryptographic ledger for hash matches" : 
                   isInvalid ? "Cryptographic hash mismatch or expired entry" :
                   "Authenticity verified via Zero-Knowledge proof"}
                </p>
              </div>
            </div>

            {!isVerified && !isInvalid && !isVerifying ? (
              <div className="space-y-8 text-left mt-4">
                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-2 w-16 bg-white/5 rounded-full" />
                      <div className="h-4 w-32 bg-white/10 rounded-md" />
                    </div>
                  ))}
                </div>
                <div className="h-24 w-full bg-white/5 rounded-xl mt-auto" />
              </div>
            ) : isVerifying ? (
              <div className="flex flex-col items-center justify-center flex-1 space-y-10 py-10">
                <div className="flex items-center justify-center">
                  <LoaderCircle className="size-16 text-white/20 animate-spin" />
                </div>
                <div className="relative w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-white/40 animate-[progress_2s_ease-in-out_infinite] origin-left" style={{ width: '40%' }} />
                </div>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
                  Cryptographic Ledger Syncing
                </p>
              </div>
            ) : isInvalid ? (
              <div ref={refs.error} className="text-left flex flex-col items-center justify-center flex-1 gap-6 mt-4">
                <div className="size-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(239,68,68,0.2)]">
                   <AlertCircle className="size-12 text-red-500" />
                </div>
                <div className="space-y-2 text-center max-w-sm">
                  <h4 className="text-white font-bold text-lg">Verification Failed</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The provided document fragment does not match any authenticated record in our blockchain vault. This could be due to unauthorized modification or an expired certificate.
                  </p>
                </div>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="mt-4 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Clear and Retry
                </Button>
              </div>
            ) : (
              <div ref={refs.results} className="text-left flex flex-col h-full gap-8 mt-4 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <DetailItem icon={<FileText />} label="Certificate Title" value={fileData.title} />
                  <DetailItem icon={<Link2 />} label="Certificate Hash" value={fileData.hash} isCode />
                  <DetailItem icon={<User />} label="Issued To" value={fileData.issuedTo} />
                  <DetailItem icon={<Database />} label="Network" value={fileData.network} />
                  <DetailItem icon={<Link2 />} label="Issued By" value={fileData.issuedBy} />
                  <DetailItem icon={<Calendar />} label="Issue Date" value={fileData.date} />
                </div>

                <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Verification ID:</span>
                    <span className="text-xs font-mono text-white/60">{fileData.verificationId}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-blue-400 p-0 hover:bg-transparent">
                    View on Explorer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailItem({ icon, label, value, isCode = false }) {
  return (
    <div className="space-y-2.5 group/item min-w-0">
      <div className="flex items-center gap-2 text-muted-foreground/60">
        {React.cloneElement(icon, { className: "size-3.5" })}
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <div className={cn(
        "text-sm font-medium transition-colors group-hover/item:text-white leading-relaxed",
        isCode 
          ? "font-mono text-blue-400/90 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 break-all inline-block" 
          : "text-white/90 break-words"
      )}>
        {value}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";


