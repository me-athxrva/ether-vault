"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ShieldCheck, Database, Link2, Calendar, User, FileText, LoaderCircle, AlertCircle, Hash, Search, XCircle as XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function VerifyPage() {
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [files, setFiles] = useState([]);
  const [verifyIdInput, setVerifyIdInput] = useState("");
  const [results, setResults] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  // Handle direct verification via URL (QR Code or Shared Link)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      // If already verified or in error state, reset first
      if (isVerified || isInvalid) {
        handleReset();
      }
      
      setVerifyIdInput(id);
      // Small delay to ensure state is set before triggering validation
      setTimeout(() => {
        const validateBtn = document.getElementById('validate-btn');
        if (validateBtn) validateBtn.click();
      }, 800);
    }
  }, [pathname, isVerified, isInvalid]); // Watch for result state to handle re-scans
  
  const refs = {
    glow: useRef(null),
    container: useRef(null),
    resultsRef: useRef(null),
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

  const generateSHA256 = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleValidate = async () => {
    if (files.length === 0 && !verifyIdInput) return;
    
    setIsVerifying(true);
    setIsVerified(false);
    setIsInvalid(false);
    setResults([]);

    try {
      let payload = {};
      
      if (files.length > 0) {
        const rawFile = files[0].file;
        if (!rawFile) throw new Error("No file found in selection");
        
        const hash = await generateSHA256(rawFile);
        payload = { hash };
      } else {
        payload = { verifyId: verifyIdInput };
      }

      const response = await axios.post("/api/document/verify", payload);
      
      if (response.data.status === "success") {
        const data = response.data.results || [response.data.data];
        setResults(data);
        setIsVerified(true);
        
        setTimeout(() => {
          gsap.from(".result-card", {
            opacity: 0,
            y: 10,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
          });
        }, 100);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setIsInvalid(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setIsVerified(false);
    setIsInvalid(false);
    setIsVerifying(false);
    setFiles([]);
    setVerifyIdInput("");
    setResults([]);
    setResetKey(prev => prev + 1);
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
            EtherVault Verifier
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Locally hash certificates to verify authenticity without uploading sensitive files.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Input Section */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
            <div className="text-left space-y-2">
              <h2 className="text-2xl font-semibold text-white">Verification Source</h2>
              <p className="text-muted-foreground text-sm">Upload a PDF to hash locally or enter a Verification ID.</p>
            </div>
            
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex-1">
                <FileUpload 
                  key={resetKey}
                  className="w-full"
                  maxFiles={1}
                  accept=".pdf"
                  onFilesChange={(newFiles) => {
                    setFiles(newFiles);
                    if (newFiles.length > 0) setVerifyIdInput("");
                  }}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-white transition-colors">
                  <Hash className="size-4" />
                </div>
                <input 
                  type="text"
                  placeholder="Or enter Verification ID (e.g. DOC-XXXXXX)"
                  value={verifyIdInput}
                  onChange={(e) => {
                    setVerifyIdInput(e.target.value);
                    if (e.target.value) setFiles([]);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                id="validate-btn"
                onClick={handleValidate} 
                disabled={(files.length === 0 && !verifyIdInput) || isVerifying || isVerified}
                className="flex-1 py-6 text-lg font-semibold bg-white hover:bg-white/80 text-black border-0 disabled:bg-white/10 disabled:text-white/20"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin size-5" /> Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-5" /> Verify Authenticity
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

          {/* Right Column: Results Section */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-10 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-5 text-left pb-4 border-b border-white/5">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500",
                !isVerified && !isInvalid && !isVerifying ? "border-dashed border-white/20 bg-white/5" : 
                isVerifying ? "border-blue-500/50 bg-blue-500/10 animate-pulse" : 
                isInvalid || results.some(r => r.isRevoked) ? "border-red-500/50 bg-red-500/10" :
                "border-green-500/50 bg-green-500/10"
              )}>
                {!isVerified && !isInvalid && !isVerifying ? (
                  <ShieldCheck className="size-6 text-white/20" />
                ) : isVerifying ? (
                  <LoaderCircle className="size-6 text-blue-500 animate-spin" />
                ) : isInvalid || results.some(r => r.isRevoked) ? (
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
                  isInvalid || results.some(r => r.isRevoked) ? "text-red-400" :
                  "text-green-400"
                )}>
                  {!isVerified && !isInvalid && !isVerifying ? "Ready to Verify" : 
                   isVerifying ? "Scanning Records..." : 
                   isInvalid ? "Record Not Found" :
                   results.some(r => r.isRevoked) ? "Document Revoked" : "Verification Successful"}
                </h3>
                <p className="text-muted-foreground/60 text-sm">
                  {!isVerified && !isInvalid && !isVerifying ? "Scan your certificate to see proof of issuance" : 
                   isVerifying ? "Verifying local hash against blockchain registry" : 
                   isInvalid ? "The provided fragment does not match any authenticated record" :
                   results.some(r => r.isRevoked) ? "This document has been invalidated by the issuer" : `Found ${results.length} valid issuance record(s)`}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {!isVerified && !isInvalid && !isVerifying ? (
                <div className="space-y-8 text-left mt-4 opacity-40 grayscale">
                  <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-2 w-16 bg-white/5 rounded-full" />
                        <div className="h-4 w-32 bg-white/10 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : isVerifying ? (
                <div className="flex flex-col items-center justify-center h-full space-y-10 py-10">
                  <LoaderCircle className="size-16 text-white/20 animate-spin" />
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">
                    Synchronizing with Ledger
                  </p>
                </div>
              ) : isInvalid ? (
                <div ref={refs.error} className="text-left flex flex-col items-center justify-center h-full gap-6">
                  <div className="size-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(239,68,68,0.2)]">
                     <AlertCircle className="size-10 text-red-500" />
                  </div>
                  <div className="space-y-2 text-center max-w-sm">
                    <h4 className="text-white font-bold text-lg">Not Authenticated</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We couldn't find a matching record. The document may be altered, or the Verification ID might be incorrect.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-2">
                  {results.map((res, idx) => (
                    <div 
                      key={res.verifyId} 
                      className="result-card bg-white/5 border border-white/5 hover:border-white/10 transition-all rounded-2xl p-6 text-left space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className={cn(
                          "flex items-center gap-2 px-2.5 py-1 rounded-full border",
                          res.isRevoked 
                            ? "bg-red-500/10 border-red-500/20" 
                            : "bg-green-500/10 border-green-500/20"
                        )}>
                          {res.isRevoked ? (
                            <XCircleIcon className="size-3 text-red-500" />
                          ) : (
                            <ShieldCheck className="size-3 text-green-500" />
                          )}
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-tighter",
                            res.isRevoked ? "text-red-500" : "text-green-500"
                          )}>
                            {res.isRevoked ? "Revoked / Invalid" : "Verified Issuance"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-white/20">{res.verifyId}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <DetailItem icon={<FileText />} label="Title" value={res.title} />
                        <DetailItem icon={<Database />} label="Issuing Body" value={res.organisation} />
                        <DetailItem icon={<User />} label="Issued By" value={res.issuer} />
                        <DetailItem icon={<User />} label="Issued To" value={res.receiver} />
                        <DetailItem icon={<Calendar />} label="Issue Date" value={res.issuedAt} />
                        {res.txHash && (
                          <DetailItem 
                            icon={<Hash />} 
                            label="Blockchain Hash" 
                            value={
                              <a 
                                href={`https://amoy.polygonscan.com/tx/${res.txHash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10"
                              >
                                {`${res.txHash.substring(0, 8)}...${res.txHash.substring(res.txHash.length - 6)}`}
                              </a>
                            } 
                          />
                        )}
                      </div>

                    </div>
                  ))}

                  {/* QR Code Section for Success */}
                  {results[0]?.verifyId && (
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                      <div className="p-3 bg-white rounded-xl shadow-2xl">
                        <QRCodeSVG 
                          value={`${window.location.origin}${pathname}?id=${results[0].verifyId}`}
                          size={100}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Authenticity Proof</p>
                        <p className="text-[10px] font-mono text-white/20">{results[0].verifyId}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailItem({ icon, label, value, isCode = false }) {
  return (
    <div className="space-y-1.5 group/item min-w-0">
      <div className="flex items-center gap-2 text-muted-foreground/40">
        {React.cloneElement(icon, { className: "size-3" })}
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      </div>
      <div className={cn(
        "text-sm font-medium transition-colors group-hover/item:text-white leading-relaxed truncate",
        isCode 
          ? "font-mono text-blue-400/90 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 break-all inline-block" 
          : "text-white/90 wrap-break-word"
      )}>
        {value}
      </div>
    </div>
  );
}


