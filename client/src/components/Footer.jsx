"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const AsciiAnim = () => {
  const [blockHeight, setBlockHeight] = useState(1908234);
  const [ping, setPing] = useState(14);
  const [hexVal, setHexVal] = useState("0x8A7...2B9");

  useEffect(() => {
    const chars = "0123456789ABCDEF";
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setPing(Math.floor(Math.random() * 8) + 10);
      }
      if (Math.random() > 0.8) {
        let hash = "0x";
        for (let i = 0; i < 3; i++) hash += chars[Math.floor(Math.random() * 16)];
        hash += "...";
        for (let i = 0; i < 3; i++) hash += chars[Math.floor(Math.random() * 16)];
        setHexVal(hash);
      }
    }, 200);

    const blockInterval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearInterval(blockInterval);
    };
  }, []);

  return (
    <div className="font-mono flex h-full w-full items-center justify-center opacity-80">
      <div className="flex flex-col gap-[2px] text-[10px] tracking-widest text-[#666666]">
        <div className="text-emerald-500/70 mb-2 font-bold">[SYS: ONLINE]</div>

        <div className="flex justify-between gap-4">
          <span>NETWORK:</span>
          <span className="text-[#a3a3a3]">ETH SEPOLIA</span>
        </div>

        <div className="flex justify-between gap-4">
          <span>RPC_LINK:</span>
          <span className="text-[#a3a3a3]">WSS_{ping}ms</span>
        </div>

        <div className="flex justify-between gap-4 mt-2">
          <span>CURRENT_BLOCK:</span>
          <span className="text-[#d4d4d4]">#{blockHeight.toLocaleString("en-US")}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span>VERIFYING:</span>
          <span className="text-[#8a8a8a]">{hexVal}</span>
        </div>
      </div>
    </div>
  );
};

export default function Footer() {

  const pathname = usePathname();
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 200,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            markers: false,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <footer ref={footerRef} className="relative z-50 -mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] mx-auto flex h-[60vh] w-full flex-col justify-end px-6 pb-10 lg:px-10 rounded-t-[4rem] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-full bg-surface-lowest blur-[160px]" />
        <div
          className="absolute inset-0 bg-repeat mix-blend-lighten opacity-[0.035]"
          style={{
            backgroundImage:
              "url('https://framerusercontent.com/images/kelEr6s1qyt801dQcO45jKcaNkk.gif')",
          }}
        />
      </div>
      <div className="relative z-10 flex h-full w-full flex-col justify-between pt-16">

        <div className="flex w-full grow">
          <div className="flex w-[70%] items-center pr-10">
            <div className="grid w-full grid-cols-3 gap-8">
              <div>
                <h4 className="font-(family-name:--font-display) text-sm font-bold tracking-widest text-[#d4d4d4] uppercase mb-6">Project</h4>
                <div className="flex flex-col gap-4">
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Architecture</Link>
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Tech Stack</Link>
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Changelog</Link>
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Future Scope</Link>
                </div>
              </div>
              <div>
                <h4 className="font-(family-name:--font-display) text-sm font-bold tracking-widest text-[#d4d4d4] uppercase mb-6">Source</h4>
                <div className="flex flex-col gap-4">
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Repository</Link>
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Smart Contracts</Link>
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Local Setup</Link>
                  <Link href="#" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">ReadMe Docs</Link>
                </div>
              </div>
              <div>
                <h4 className="font-(family-name:--font-display) text-sm font-bold tracking-widest text-[#d4d4d4] uppercase mb-6">Creator</h4>
                <div className="flex flex-col gap-4">
                  <Link href="https://atharvadeore.vercel.app" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Dev</Link>
                  <Link href="https://github.com/atharvadeore" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">GitHub</Link>
                  <Link href="https://www.linkedin.com/in/atharvadeore/" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">LinkedIn</Link>
                  <Link href="mailto:[abc123@gmail.com]" className="text-sm font-medium tracking-wide text-[#8a8a8a] transition-colors hover:text-white">Contact</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-[30%] flex-col items-center justify-center border-l border-white/5 pl-10 opacity-70">
            <AsciiAnim />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-center gap-8 border-t border-white/5 pt-8 sm:grid-cols-3">
          <div className="flex justify-center sm:justify-start">
            <Link
              href="/"
              className="font-(family-name:--font-display) text-sm font-bold tracking-tight text-[#474747]"
            >
              EtherVault
            </Link>
          </div>

          <div className="flex justify-center gap-8">
            {["Terms", "Privacy", "Cookies", "Licenses"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-medium uppercase tracking-widest text-[#474747] transition-colors hover:text-[#8a8a8a]"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex justify-center sm:justify-end">
            <p className="text-[10px] uppercase tracking-[0.2em] text-surface-highest">
              © {new Date().getFullYear()} EtherVault
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
