"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <ReactLenis key={pathname} root options={{ lerp: 0.05, duration: 1.5, smoothTouch: false }}>
      {children}
    </ReactLenis>
  );
}
