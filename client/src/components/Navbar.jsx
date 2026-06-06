"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full rounded-none border-b border-white/10 md:top-[2.5%] md:left-1/4 md:w-[50%] md:rounded-full md:border md:border-b-2 z-50 backdrop-blur-md bg-white/5 will-change-[transform,opacity] transition-all duration-300"
    >
      <div className="mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
        <Link href="/" className="font-(family-name:--font-display) text-2xl font-bold tracking-tight text-white">
          EtherVault
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {["Verify"].map((item) => (
            <li key={item}>
              <Link href={"/" + item.toLowerCase()} className="rounded-full px-4 py-2 text-sm font-medium text-[#b3b3b3] transition-colors duration-250 hover:bg-white/10 hover:text-white">
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-2 rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/10 transition-colors md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100 border-t border-white/10" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4 bg-black/95 backdrop-blur-md">
          {["Verify"].map((item) => (
            <Link
              key={item}
              href={"/" + item.toLowerCase()}
              className="text-lg font-medium text-[#b3b3b3] transition-colors duration-250 hover:text-white py-2"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
