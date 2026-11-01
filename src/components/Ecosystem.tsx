import React from 'react';
import { Link } from 'react-router-dom';
import { ZapIcon } from './Octicons';

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16">
      <div className="font-mono text-xs uppercase tracking-wider text-ink2 mb-4">Featured showcase archetype</div>
      <div className="grid md:grid-cols-2 gap-6 bg-bg1 border border-ink3 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 sm:p-8 md:border-r md:border-ink3 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-g-text bg-g/10 border border-g-dim rounded-full px-3 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-g" /> Active Showcase · Matching Enabled
            </div>
            <div className="text-2xl font-outfit font-extrabold text-ink0 mb-2">Campus EcoSync</div>
            <p className="text-ink1 text-sm leading-relaxed mb-6">
              A student-led initiative to optimize campus resource recovery with smart logistics. The founding team knows React and needs database architecture and UI/UX design support to ship.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/explore"
              className="font-sans text-xs font-semibold bg-g text-white px-4 py-2.5 rounded-lg hover:bg-g-dim transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Explore in Gallery</span>
              <span>➔</span>
            </Link>
            <a
              className="font-mono text-xs border border-ink3 text-ink1 hover:text-ink0 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
              href="https://github.com/DevSnapz"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Open Roles (2)
            </a>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-bg2 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[0.7rem] font-mono text-ink2 uppercase tracking-wider">Status</div>
              <div className="text-base font-outfit font-bold text-g mt-1">Seeking Collaborators ●</div>
            </div>
            <div>
              <div className="text-[0.7rem] font-mono text-ink2 uppercase tracking-wider">Domain Focus</div>
              <div className="font-sans text-sm text-ink0 font-medium mt-1">Campus Automation & IoT</div>
            </div>
            <div>
              <div className="text-[0.7rem] font-mono text-ink2 uppercase tracking-wider">Identified Gaps</div>
              <div className="text-sm font-semibold text-gold mt-1 flex items-center gap-1">
                <ZapIcon className="w-3.5 h-3.5 fill-current text-gold" />
                <span>PostgreSQL · UI/UX</span>
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] font-mono text-ink2 uppercase tracking-wider">Founding Stack</div>
              <div className="font-mono text-xs text-g-text mt-1">React · Tailwind · Node.js</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
