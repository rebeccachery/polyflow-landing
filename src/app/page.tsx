"use client";

import React from "react";
import MapComponent from "@/components/Map";
import { Play, ArrowRight, Globe, Mic2, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* Header */}
      <header className="container flex-center" style={{ justifyContent: "space-between", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Mic2 size={32} color="var(--primary)" />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.05em" }}>Polyflow</h1>
        </div>
        <a href="#waitlist" className="button button-outline" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}>
          Join Waitlist
        </a>
      </header>

      {/* Hero Section */}
      <section className="section container text-center">
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }} className="animate-fade-in">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", padding: "0.5rem 1rem", borderRadius: "99px", marginBottom: "2rem", color: "var(--primary)", fontSize: "0.875rem", fontWeight: 600 }}>
            <Sparkles size={16} />
            <span>Pre-Seed MVP Coming Soon</span>
          </div>
          <h2 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Give Voice to the <br /><span className="gradient-text">Under-Resourced</span>
          </h2>
          <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Polyflow is an AI speech feedback system built first for Haitian Creole speakers. Unlocking human potential by bridging the language gap for millions globally.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#waitlist" className="button" style={{ padding: "1rem 2rem", fontSize: "1.125rem" }}>
              Join the Waitlist <ArrowRight size={20} />
            </a>
            <a href="#demo" className="button button-outline" style={{ padding: "1rem 2rem", fontSize: "1.125rem" }}>
              <Play size={20} fill="currentColor" /> Watch Demo
            </a>
          </div>
        </div>

        {/* Video Demo Placeholder */}
        <div id="demo" className="glass-card animate-fade-in delay-200" style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", padding: "1rem" }}>
          <div style={{ background: "#111118", borderRadius: "1rem", overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80') center/cover", opacity: 0.4 }}></div>
            <button style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--primary)", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)" }}>
              <Play size={32} fill="currentColor" style={{ marginLeft: "4px" }} />
            </button>
          </div>
        </div>
      </section>

      {/* Why Polyflow Section */}
      <section className="section container">
        <div className="glass-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Why <span className="gradient-text">Polyflow?</span></h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              As a pre-seed startup, we are building our MVP with a hyper-focused strategy. We start with Haitian Creole because it presents an massive opportunity for impact. By providing real-time speech feedback to an underserved population, we empower individuals economically and socially.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: 1.7 }}>
              Our technology scales easily, providing a blueprint for optimizing deployment across hundreds of other under-resourced languages. The potential for growth and success is deeply rooted in this strategic entry point.
            </p>
          </div>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", padding: "1.5rem", borderRadius: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <Globe color="var(--secondary)" size={28} />
              <div>
                <h4 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>High Impact Deployment</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Targeting regions with the most urgent need for educational accessibility.</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", padding: "1.5rem", borderRadius: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <TrendingUp color="var(--primary)" size={28} />
              <div>
                <h4 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Massive Growth Potential</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Starting with Haitian Creole allows us to build an adaptable engine for a trillion-dollar language learning market.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section container text-center">
        <h3 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Educational Accessibility Map</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", maxWidth: "700px", margin: "0 auto 3rem" }}>
          Highlighting our deployment strategy across major hotspots for Haitian Creole speakers in North and South America.
        </p>
        <div style={{ position: "relative" }}>
          {/* Plotly map component */}
          <MapComponent />
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="section container text-center">
        <div className="glass-card" style={{ maxWidth: "600px", margin: "0 auto", background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)" }}>
          <h3 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Be the First to Try Polyflow</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Join the waitlist to get early access to our MVP and help shape the future of language learning.
          </p>
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Your Name"
              required
              style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", background: "rgba(0,0,0,0.5)", border: "1px solid var(--card-border)", color: "white", outline: "none", fontSize: "1rem" }}
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", background: "rgba(0,0,0,0.5)", border: "1px solid var(--card-border)", color: "white", outline: "none", fontSize: "1rem" }}
            />
            <button type="submit" className="button" style={{ width: "100%", padding: "1rem", fontSize: "1.125rem", marginTop: "0.5rem" }}>
              Join the Waitlist
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--card-border)", padding: "3rem 0", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Mic2 size={20} color="var(--primary)" />
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Polyflow</span>
          </div>
          <p>© {new Date().getFullYear()} Polyflow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
