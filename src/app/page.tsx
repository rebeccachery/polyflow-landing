"use client";

import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ProblemSection from "@/components/ProblemSection";
import CreoleFeature from "@/components/CreoleFeature";
import EchoDemo from "@/components/EchoDemo";
import WhyPolyflow from "@/components/WhyPolyflow";
import DataMoat from "@/components/DataMoat";
import Community from "@/components/Community";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Toaster richColors position="top-center" />
      <Navbar />
      <Hero />
      <Stats />
      <ProblemSection />
      <CreoleFeature />
      <EchoDemo />
      <WhyPolyflow />
      <DataMoat />
      <Community />
      <Waitlist />
      <Footer />
    </main>
  );
}
