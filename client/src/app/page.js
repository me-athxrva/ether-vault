import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pillars from "@/components/Pillars";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#e8e8e8] font-(family-name:--font-body)">
      <Navbar />
      <Hero />
      <Features />
      <Pillars />
      <CTASection />
      <Footer />
    </div>
  );
}
