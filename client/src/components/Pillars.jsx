"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileCheck, Lock, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const pillarsData = [
  {
    step: "1",
    title: "Issue Asset",
    desc: "Upload your digital document. Our system automatically generates a unique cryptographic fingerprint.",
    icon: FileCheck,
  },
  {
    step: "2",
    title: "Immutabilize",
    desc: "The metadata and signature are permanently written to the blockchain network for eternity.",
    icon: Lock,
  },
  {
    step: "3",
    title: "Global Portal",
    desc: "Anyone can instantly verify the document's authenticity via a public portal or direct API.",
    icon: Globe,
  },
];

export default function Pillars() {
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 50, autoAlpha: 0, scale: 0.92 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
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
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-32 lg:px-10">
      <div
        ref={headerRef}
        className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#8a8a8a]">
            Process Blueprint
          </p>
          <h2 className="max-w-lg font-(family-name:--font-display) text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            The Pillars of Verification
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-[#8a8a8a]">
          Our three-step process ensures every credential is tamper-proof,
          instantly verifiable, and globally accessible.
        </p>
      </div>

      <div ref={cardsRef} className="mt-20 grid gap-5 sm:grid-cols-3">
        {pillarsData.map((pillar) => (
          <div
            key={pillar.step}
            className="group rounded-[3rem] bg-surface-low p-10 transition-all duration-300 hover:bg-[#222121] micro-glow card-hover"
          >
            <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-surface-high font-(family-name:--font-display) text-sm font-bold text-white transition-transform duration-500 group-hover:-translate-y-1">
              {pillar.step}
            </div>
            <h3 className="font-(family-name:--font-display) text-lg font-bold uppercase tracking-wider text-white">
              {pillar.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#8a8a8a]">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
