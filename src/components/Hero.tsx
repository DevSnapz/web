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
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 py-14 sm:py-20 lg:py-24 grid md:grid-cols-12 gap-10 lg:gap-14 items-center">
      
      {/* LEFT COLUMN: Headings, Value Prop & CTAs */}
      <div className="md:col-span-7 space-y-6">
        
        {/* Purple eyebrow label */}
        <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-[#635BFF] bg-[#F3F1FF] border border-[#635BFF]/25 rounded-full px-3.5 py-1 font-semibold tracking-wider uppercase">
          ✨ THE STUDENT BUILDER COMMUNITY
        </div>

        {/* Large heading */}
        <h1 className="font-sans font-extrabold text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] leading-[1.12] tracking-tight text-[#111827]">
          Great ideas deserve <br />
          <span className="text-[#635BFF]">great teammates.</span>
        </h1>

        {/* Description */}
        <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed max-w-[520px]">
          Discover inspiring projects, connect with skilled collaborators, and turn your ideas into something real.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-1">
          <Link
            to="/explore"
            className="font-sans text-sm font-semibold bg-[#635BFF] hover:bg-[#5246C9] text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Explore Projects</span>
            <span>→</span>
          </Link>

          <a
            href="#how-it-works"
            onClick={handleHowItWorksClick}
            className="font-sans text-sm font-semibold bg-white hover:bg-[#F7F8FC] text-[#111827] border border-[#E5E7EB] px-5 py-3 rounded-xl shadow-xs transition-all active:scale-95 inline-flex items-center"
          >
            How it works
          </a>
        </div>

        {/* Small supporting text */}
        <div className="text-xs text-[#9CA3AF] font-medium pt-1">
          Open source · Student focused · Built for collaboration
        </div>
      </div>

      {/* RIGHT COLUMN: Polished Application Preview Card */}
      <div className="md:col-span-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-6 sm:p-7 space-y-5 transition-all">
          
          {/* Top Project Card Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F3F1FF] text-[#635BFF] flex items-center justify-center font-bold text-sm">
                  ♻️
                </div>
                <h3 className="font-bold text-base text-[#111827]">
                  Campus Recycling App
                </h3>
              </div>
              <span className="text-[0.68rem] font-medium text-[#17936C] bg-[#ECFDF5] border border-[#17936C]/20 px-2.5 py-0.5 rounded-full">
                Open to join
              </span>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed mt-2">
              A student project looking for the right people to make an environmental impact.
            </p>

            {/* Technology Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['React', 'PostgreSQL', 'UI/UX'].map((tag) => (
                <span
                  key={tag}
                  className="text-[0.7rem] font-mono bg-[#F3F1FF] text-[#635BFF] border border-[#635BFF]/20 px-2.5 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5E7EB]" />

          {/* Suggested Collaborators Section */}
          <div className="space-y-3">
            <div className="text-[0.68rem] font-mono uppercase tracking-wider text-[#9CA3AF] font-semibold">
              Suggested collaborators
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8FC] border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#635BFF]/15 text-[#635BFF] font-bold text-xs flex items-center justify-center">
                  AM
                </div>
                <div>
                  <div className="font-bold text-xs text-[#111827]">Alex M.</div>
                  <div className="text-[0.68rem] text-[#6B7280]">Database developer</div>
                </div>
              </div>
              <span className="text-[0.65rem] font-semibold text-[#635BFF] bg-[#F3F1FF] border border-[#635BFF]/25 px-2.5 py-1 rounded-md">
                Strong match
              </span>
            </div>
          </div>

          {/* Soft-Purple Recommendation Explanation Panel */}
          <div className="bg-[#F3F1FF] border border-[#635BFF]/25 rounded-xl p-3.5 space-y-1">
            <div className="text-xs font-bold text-[#635BFF] flex items-center gap-1.5">
              <span>✨</span>
              <span>Why this match?</span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              PostgreSQL skills align with an identified project requirement.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
