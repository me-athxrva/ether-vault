"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Link from "next/link";
import { Pill } from "./kibo-ui/pill";
import { ChevronRight, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

export default function Hero() {
  const pathname = usePathname();
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const refs = {
    pill: useRef(null),
    heading: useRef(null),
    desc: useRef(null),
    buttons: useRef(null),
    glow: useRef(null),
  };

  useEffect(() => {
    const checkBackend = async () => {
      let toastId;
      try {
        // Show loading toast after a short delay if backend hasn't responded
        const timeoutId = setTimeout(() => {
          toastId = sileo.info({
            title: "Waking up server",
            description: "Backend is spinning up on Render. This may take a few seconds.",
            duration: 10000,
          });
        }, 1500);

        const res = await fetch("/api/auth/session");
        clearTimeout(timeoutId);
        
        if (res.ok || res.status === 401) {
          setIsBackendReady(true);
          if (toastId) {
            sileo.success({
              title: "System Ready",
              description: "Backend connection established.",
            });
          }
        }
      } catch (err) {
        console.error("Backend check failed:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [refs.heading.current, refs.pill.current, refs.desc.current, refs.buttons.current].filter(Boolean);
      if (targets.length) {
        gsap.set(targets, { autoAlpha: 0 });
      }

      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        refs.heading.current,
        {
          autoAlpha: 0,
          scale: 0.97,
          filter: "blur(8px)"
        },
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
        }
      );

      tl.fromTo(
        refs.pill.current,
        {
          autoAlpha: 0
        },
        {
          autoAlpha: 1,
          duration: 2,
          ease: "power3.out"
        },
        "<"
      );

      tl.fromTo(
        refs.desc.current,
        {
          autoAlpha: 0,
          filter: "blur(8px)"
        },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out"
        },
        "<"
      );

      tl.fromTo(
        refs.buttons.current,
        {
          autoAlpha: 0,
          filter: "blur(8px)"
        },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out"
        },
        "<"
      );

      tl.from(
        refs.glow.current,
        {
          scale: 0,
          opacity: 0,
          duration: 3,
          ease: "power3.out"
        },
        0
      );
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <section className="relative z-0 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">

      <div className="pointer-events-none absolute inset-0">

        <div ref={refs.glow} className="absolute left-1/2 top-1/4 2xl:top-1/3 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[160px] will-change-[transform,opacity]" />
        <div
          className="absolute inset-0 bg-repeat mix-blend-lighten opacity-[0.035]"
          style={{
            backgroundImage:
              "url('https://framerusercontent.com/images/kelEr6s1qyt801dQcO45jKcaNkk.gif')",
          }}
        />
      </div>

      <Pill ref={refs.pill} className="flex justify-center items-center gap-1 px-4 py-3.75 mb-6 font-(family-name:--font-body) text-sm font-small text-[#c0c0c0]   bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/50 transition-none will-change-[opacity]">
        <span className="text-sm text-center">&#x1F517;</span>
        <span className="text-center">Decentralized · Permanent</span>
      </Pill>

      <h1 ref={refs.heading} className="max-w-4xl font-(family-name:--font-display) text-4xl font-semibold tracking-tight leading-[1.08] sm:text-6xl lg:text-7xl will-change-[transform,opacity,filter]">
        Architecting the Unbreakable Document Vault.
      </h1>

      <p ref={refs.desc} className="mt-8 max-w-xl font-(family-name:--font-body) text-base leading-relaxed text-[#8a8a8a] will-change-[opacity,filter]">
        Secure, tamper-proof document verification powered by blockchain.
      </p>

      <div ref={refs.buttons} className="mt-10 flex flex-wrap items-center justify-center gap-4 will-change-[opacity,filter]">
        <Link 
          href={isBackendReady ? "/recipient/login" : "#"} 
          className={cn(
            "group relative rounded-full bg-white px-7 py-3 h-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1c1c] transform-gpu will-change-transform transition-all duration-300",
            isBackendReady ? "cursor-pointer hover:scale-[1.03]" : "cursor-not-allowed opacity-50 grayscale"
          )}
        >
          {!isBackendReady && <Loader2 className="w-4 h-4 animate-spin" />}
          <span className="relative z-10">For Recipients</span>
          {isBackendReady && <ChevronRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
          {isBackendReady && <span className="pointer-events-none absolute -bottom-2 left-4 right-4 h-2.5 bg-[linear-gradient(90deg,#ff0000,#ff8a00,#ffe600,#4cff00,#00d0ff,#7b00ff,#ff00c8)] opacity-60 blur-lg transition-opacity duration-300 group-hover:opacity-80 hover:blur-3xl rounded-full" />}
        </Link>
        <Link 
          href={isBackendReady ? "/issuer/login" : "#"} 
          className={cn(
            "group relative rounded-full px-7 py-3 h-12 flex items-center gap-2 text-xs font-bold border border-white/17 uppercase tracking-widest text-[#d4d4d4] transform-gpu will-change-transform transition-all duration-300",
            isBackendReady ? "cursor-pointer hover:scale-[1.03]" : "cursor-not-allowed opacity-50"
          )}
        >
          {!isBackendReady && <Loader2 className="w-4 h-4 animate-spin" />}
          <span className="relative z-10">For Issuers</span>
          {isBackendReady && <ChevronRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
        </Link>
      </div>
    </section>
  );
}
