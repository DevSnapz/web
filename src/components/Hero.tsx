import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 grid md:grid-cols-12 gap-10 items-center">
      
      {/* LEFT COLUMN: Headings, Value Prop & GitHub Primer CTAs */}
      <div className="md:col-span-7 space-y-5">
        
        {/* Eyebrow Label: GitHub-style release badge */}
        <div className="inline-flex items-center gap-2 text-xs text-[#58a6ff] bg-[#151b23] border border-[#3d444d] rounded-full px-3 py-1 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#79c0ff]" />
          <span>DevSnapz Studio for Student Software Engineers</span>
        </div>

        {/* Large heading */}
        <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#f0f6fc] leading-[1.1]">
          Where student builders <br />
          <span className="text-[#58a6ff]">assemble teams.</span>
        </h1>

        {/* Description */}
        <p className="text-[#9198a1] text-sm sm:text-base leading-relaxed max-w-[520px]">
          Discover inspiring student repositories, analyze technical skill gaps, and collaborate on software architectures that matter.
        </p>

        {/* Action Buttons (Primer Buttons) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/explore"
            className="text-xs font-semibold bg-[#1f6feb] hover:bg-[#2a7aef] text-white px-5 py-2.5 rounded-md shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Explore Repositories</span>
            <span>→</span>
          </Link>

          <a
            href="#how-it-works"
            onClick={handleHowItWorksClick}
            className="text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#3d444d] px-4 py-2.5 rounded-md shadow-xs transition-colors"
          >
            How it works
          </a>
        </div>

        <div className="text-[11px] text-[#656c76] font-mono pt-1">
          git clone devsnapz · automated skill-gap matrix · ₹0 budget open source
        </div>
      </div>

      {/* RIGHT COLUMN: GitHub Repository Preview Card */}
      <div className="md:col-span-5">
        <div className="bg-[#151b23] border border-[#3d444d] rounded-md shadow-2xl p-5 space-y-4">
          
          {/* GitHub Repo Card Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                <span className="font-bold text-sm text-[#58a6ff]">
                  campus-recycling-app
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-[#ff7b72] bg-[rgba(248,81,73,0.15)] border border-[rgba(248,81,73,0.4)] px-2 py-0.2 rounded-full">
                ⚡ 2 Gaps Open
              </span>
            </div>

            <p className="text-xs text-[#9198a1] leading-relaxed mt-1.5">
              Smart IoT campus recycling bin sensors and real-time student rewards telemetry dashboard.
            </p>

            {/* GitHub Topic Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['react', 'postgresql', 'iot-telemetry'].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold bg-[rgba(56,139,253,0.15)] text-[#58a6ff] rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#3d444d]" />

          {/* Mini Skill-Gap Visualizer Box inside Hero */}
          <div className="bg-[#010409] border border-[#3d444d] rounded-md p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#79c0ff] font-semibold">✓ Known: React, Node.js</span>
              <span className="text-[#ff7b72] font-semibold">⚡ Need: Embedded C++</span>
            </div>
            <div className="w-full bg-[#151b23] h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-[#79c0ff] h-full" style={{ width: '65%' }} />
              <div className="bg-[#ff7b72] h-full" style={{ width: '35%' }} />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-[#9198a1] font-mono text-[11px]">
              <span>★ 42</span>
              <span>⑂ 9</span>
              <span>Updated today</span>
            </div>
            <Link
              to="/projects/campus-recycling-app"
              className="font-semibold text-xs text-[#58a6ff] hover:underline"
            >
              View Repository ➔
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}
