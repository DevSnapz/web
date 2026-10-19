import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#222F4C] mt-16 bg-[#0B1020]/90 backdrop-blur-md relative z-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#222F4C]/60">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                Dev<span className="text-[#635BFF]">Snapz</span>
              </span>
              <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-full bg-[#635BFF]/15 text-[#9D98FF] border border-[#635BFF]/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              The student innovation hub connecting ambitious project ideas with missing technical competencies. Discover peer builds, form cross-disciplinary teams, and launch real-world engineering solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home & Overview</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore Projects Directory</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Creator Workspace</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Student Profile & Matches</Link>
              </li>
            </ul>
          </div>

          {/* Open Source & Community */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Open-Source Community</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              DevSnapz is fully open-source and governed by the MIT License. Built for hackathons, research labs, and student engineering societies.
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/DevSnapz/web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#635BFF] hover:text-[#817AFF] transition-colors"
              >
                <span>GitHub Repository</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} DevSnapz. MIT Licensed.
          </div>
          <div className="inline-flex items-center gap-2 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
            <span>Discover · Bridge · Build Together</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
