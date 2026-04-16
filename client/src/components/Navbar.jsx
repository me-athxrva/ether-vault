"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        navRef.current,
        {
          y: -80,
          autoAlpha: 0,
          opacity: 0,
        }
      );
      gsap.fromTo(
        navRef.current,
        { y: -80, autoAlpha: 0, opacity: 0 },
        { y: 0, autoAlpha: 1, opacity: 1, duration: 1, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, [pathname]);

  return (
    <nav ref={navRef} className="fixed top-[2.5%] border rounded-full left-1/4 z-50 w-[50%] border-b-2 border-white/1 backdrop-blur-sm bg-white/5 will-change-[transform,opacity]">
      <div className="mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
        <Link href="/" className="font-(family-name:--font-display) text-2xl font-bold tracking-tight text-white">
          EtherVault
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {["Platform", "Security", "Solutions", "Portal"].map((item) => (
            <li key={item}>
              <Link href={"/" + item.toLowerCase()} className="rounded-full px-4 py-2 text-sm font-medium text-[#b3b3b3] transition-colors duration-250 hover:bg-surface-low hover:text-white">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
