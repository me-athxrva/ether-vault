"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Building2, GitBranch, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const pathname = usePathname(); 
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 50, autoAlpha: 0, scale: 0.95 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
      <div ref={titleRef} className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#8a8a8a]">
          Core Architecture
        </p>
        <h2 className="font-(family-name:--font-display) text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
          Engineered for Permanence
        </h2>
        <p className="mt-6 text-base leading-relaxed text-[#8a8a8a]">
          Infrastructure and interfaces built for archiving, cryptographic verification,
          and institutional-level access control.
        </p>
      </div>

      <div ref={cardsRef} className="mt-20 grid gap-5 md:grid-cols-2">
        <div className="group rounded-[3rem] bg-surface-low p-10 transition-all duration-300 hover:bg-[#222121] micro-glow card-hover">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-surface-high transition-transform duration-500 group-hover:-translate-y-1">
            <Shield className="h-5 w-5 text-[#d4d4d4]" />
          </div>
          <h3 className="font-(family-name:--font-display) text-xl font-bold text-white">
            Tamper-proof Security
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#8a8a8a]">
            Every document is hashed and anchored to an immutable blockchain, creating
            an indisputable proof of existence that cannot be altered or destroyed.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="rounded-full bg-surface-high px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#8a8a8a]">
              SHA-256
            </span>
            <span className="rounded-full bg-surface-high px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#8a8a8a]">
              On-Chain
            </span>
          </div>
        </div>

        <div className="group rounded-[3rem] bg-[#e8e8e8] p-10 transition-all duration-300 hover:bg-[#d4d4d4] card-hover">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#d4d4d4] transition-transform duration-500 group-hover:-translate-y-1">
            <Zap className="h-5 w-5 text-[#1a1c1c]" />
          </div>
          <h3 className="font-(family-name:--font-display) text-xl font-bold text-[#1a1c1c]">
            Instant Verification
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#474747]">
            Validate the authenticity of any credential in seconds. Verify directly
            from any browser using a public key or direct API.
          </p>
          <div className="mt-8 flex items-center gap-2">
            <span className="rounded-full bg-[#1a1c1c] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#d4d4d4]">
              REST
            </span>
            <ArrowRight className="h-4 w-4 text-[#474747]" />
          </div>
        </div>

        <div className="group rounded-[3rem] bg-surface-low p-10 transition-all duration-300 hover:bg-[#222121] micro-glow card-hover">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-surface-high transition-transform duration-500 group-hover:-translate-y-1">
            <Building2 className="h-5 w-5 text-[#d4d4d4]" />
          </div>
          <h3 className="font-(family-name:--font-display) text-xl font-bold text-white">
            Institutional Trust
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#8a8a8a]">
            Designed for GDPR, SOC 2, and EIDAS compliance with enterprise-grade
            access controls and permissioned workflows.
          </p>
        </div>

        <div className="group rounded-[3rem] bg-surface-low p-10 transition-all duration-300 hover:bg-[#222121] micro-glow card-hover">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-surface-high transition-transform duration-500 group-hover:-translate-y-1">
            <GitBranch className="h-5 w-5 text-[#d4d4d4]" />
          </div>
          <h3 className="font-(family-name:--font-display) text-xl font-bold text-white">
            Automated Pipeline
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#8a8a8a]">
            Issue thousands of credentials with our batch API. Automate issuance of
            verified credentials via API or webhook integrations.
          </p>
          <div className="mt-8">
            <Button
              variant="ghost"
              className="rounded-full bg-surface-high px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#d4d4d4] hover:bg-surface-highest"
            >
              Explore API
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
