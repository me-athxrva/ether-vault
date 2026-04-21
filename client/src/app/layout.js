import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import { sileo, Toaster } from "sileo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "EtherVault",
  description: "Decentralized Document Vault — Architecting the Unbreakable",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <Toaster
            position="bottom-right"
            options={{
              fill: "#000",
              styles: { description: "text-white/75!" },
            }}
          />
          <SmoothScroll>{children}</SmoothScroll>
        </TooltipProvider>
      </body>
    </html>
  );
}
