"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const pathname = usePathname();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current,
          { y: 60, autoAlpha: 0, scale: 0.96 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
      <div
        ref={sectionRef}
        className="relative overflow-hidden rounded-[3rem] bg-surface-lowest px-8 py-24 text-center micro-glow-lg sm:px-16 gsap-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/1.5 blur-[100px]" />
        </div>

        <h2 className="relative z-10 mx-auto max-w-2xl font-(family-name:--font-display) text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
          Secure Your Legacy
          <br />
          on the Ledger.
        </h2>
        <p className="relative z-10 mt-6 text-sm leading-relaxed text-[#8a8a8a]">
          Join the consortium for blockchain-powered document management.
        </p>
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button className="btn-metallic rounded-full px-7 py-3 text-xs font-bold uppercase tracking-widest text-[#1a1c1c] h-12">
            Create Your Vault
          </Button>
          <Button
            variant="ghost"
            className="rounded-full px-7 py-3 text-xs font-bold uppercase tracking-widest text-[#d4d4d4] hover:bg-surface-low h-12"
          >
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
