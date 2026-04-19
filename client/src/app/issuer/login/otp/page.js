"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InputOTPForm } from "@/components/input-otp";

export default function IssuerOtpVerify() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const refs = {
    glow: useRef(null),
  };

  useEffect(() => {
    const token = sessionStorage.getItem("loginToken");
    if (!token) {
      router.replace("/issuer/login");
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative z-0 min-h-screen flex items-center justify-center px-6 text-center overflow-hidden">
      <div className="pointer-events-none absolute z-1 inset-0">
        <div
          ref={refs.glow}
          className="absolute bottom-0 left-1/2 w-full h-[80vh] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-white/10 blur-[120px] will-change-[transform,opacity]"
        />
        <div
          className="absolute inset-0 bg-repeat mix-blend-lighten opacity-[0.035]"
          style={{
            backgroundImage:
              "url('https://framerusercontent.com/images/kelEr6s1qyt801dQcO45jKcaNkk.gif')",
          }}
        />
      </div>

      <div
        className="relative z-20 w-full max-w-sm 
                bg-black/40 backdrop-blur-xl 
                border border-white/10 
                rounded-[20px] p-6"
      >
        <div className="mb-4 text-left">
          <Link
            href="/issuer/login"
            className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors group w-fit"
          >
            <ArrowLeft className="size-3" />
            Back
          </Link>
        </div>
        <InputOTPForm />
      </div>
    </section>
  );
}
