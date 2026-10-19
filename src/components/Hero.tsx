import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 grid md:grid-cols-12 gap-10 lg:gap-12 items-center py-16 sm:py-20 border-b border-ink3">
      
      {/* Left Column (7 cols on lg) */}
      <div className="md:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-g-text bg-g/10 border border-g-dim rounded-full px-3 py-1 font-medium"> 
          <span className="w-2 h-2 rounded-full bg-g animate-pulse" /> Student Innovation Hub · Open for Builders
        </div>

        <h1 className="font-outfit font-extrabold text-[clamp(2.4rem,4.5vw,3.75rem)] leading-[1.05] tracking-tight text-ink0">
          Great ideas deserve <br />
          <span className="text-g">great teammates</span>.
        </h1>

        <p className="text-ink1 text-sm sm:text-base leading-relaxed max-w-[500px]">
          DevSnapz bridges student project ideas with missing technical competencies through explainable peer discovery, skill-gap analysis, and verified campus collaboration.
        </p>

        <div className="flex gap-3 flex-wrap pt-2">
          <Link
            to="/explore"
            className="font-sans text-xs font-semibold bg-g text-white px-5 py-2.5 rounded-lg hover:bg-g-dim shadow-sm hover:shadow-[0_0_20px_rgba(99,91,255,0.25)] transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Explore Projects</span>
            <span>➔</span>
          </Link>
          
          <Link
            to="/profile"
            className="font-sans text-xs font-semibold border border-ink3 bg-bg1 text-ink0 hover:bg-bg2 px-4 py-2.5 rounded-lg transition-all"
          >
            Publish Your Idea
          </Link>

          <a
            href="https://github.com/DevSnapz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs border border-ink3 text-ink1 hover:text-ink0 px-3.5 py-2.5 rounded-lg transition-colors hidden sm:inline-flex items-center gap-2"
          >
            GitHub Org
          </a>
        </div>
      </div>

      {/* Right Column: Live Product Demonstration Preview Card (5 cols on lg) */}
      <div className="md:col-span-5 bg-bg1 border border-ink3 rounded-2xl overflow-hidden shadow-2xl">
        {/* Card Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg2 border-b border-ink3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-[0.68rem] text-ink2">matching_engine_preview.tsx</span>
        </div>

        {/* Card Body: Real Project & Match Demo */}
        <div className="p-5 space-y-4">
          
          {/* Project Box */}
          <div className="p-4 bg-bg2 rounded-xl border border-ink3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-outfit font-bold text-sm text-ink0">Campus EcoSync</span>
              <span className="font-mono text-[0.65rem] text-g-text bg-g/10 px-2 py-0.5 rounded border border-g-dim">
                Active Project
              </span>
            </div>
            <p className="text-xs text-ink1">
              Smart IoT campus resource recovery network. Needs backend database architect to ship.
            </p>
            
            {/* Team has vs gaps */}
            <div className="mt-3 pt-3 border-t border-ink3/60 space-y-2">
              <div className="flex items-center justify-between text-[0.7rem] font-mono">
                <span className="text-ink2">Team Knows:</span>
                <span className="text-ink0">React · Tailwind · Node.js</span>
              </div>
              <div className="flex items-center justify-between text-[0.7rem] font-mono">
                <span className="text-gold font-semibold">Missing Gap:</span>
                <span className="text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                  ⚡ PostgreSQL Architect
                </span>
              </div>
            </div>
          </div>

          {/* Surfaced Match Box */}
          <div className="p-4 bg-gradient-to-br from-g/10 to-bg2 rounded-xl border border-g-dim">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[0.68rem] uppercase tracking-wider text-g font-bold">
                ✓ High-Affinity Match Surfaced
              </span>
              <span className="w-2 h-2 rounded-full bg-g animate-ping" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-bg3 border border-ink3 flex items-center justify-center font-bold text-xs text-ink0">
                MP
              </div>
              <div>
                <div className="font-outfit font-bold text-xs text-ink0">Maya Patel</div>
                <div className="font-mono text-[0.68rem] text-ink2">CSE '25 · PostgreSQL & Prisma (2 yrs)</div>
              </div>
            </div>

            <p className="text-[0.72rem] text-ink1 mt-2.5 bg-bg1/80 p-2.5 rounded-lg border border-ink3/50 leading-relaxed">
              <strong className="text-ink0">Why suggested:</strong> Maya has verified relational schema experience matching Campus EcoSync's exact backend gap.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
