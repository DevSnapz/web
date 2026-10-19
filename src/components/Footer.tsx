import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] mt-16 bg-white transition-colors relative z-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E5E7EB]">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-sans font-extrabold text-xl tracking-tight text-[#111827]"
            >
              DevSnapz<span className="text-[#F9735B]">.</span>
            </Link>
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm">
              The student innovation platform where students discover projects, find collaborators, identify skill gaps, and build innovative products together.
            </p>
          </div>

          {/* Project Navigation */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#111827] font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#6B7280]">
              <li>
                <Link to="/" className="hover:text-[#111827] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-[#111827] transition-colors">Explore Projects</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#111827] transition-colors">Workspace</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#111827] transition-colors">Student Profile</Link>
              </li>
            </ul>
          </div>

          {/* Open-Source & Contribution */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#111827] font-semibold">
              Open Source
            </h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              DevSnapz is fully open source and governed by the MIT License. Contributions and feature suggestions are welcome from students worldwide.
            </p>
            <div className="pt-1 flex items-center gap-4">
              <a
                href="https://github.com/DevSnapz/web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:text-[#5246C9] transition-colors"
              >
                <span>GitHub Repository</span>
                <span>↗</span>
              </a>
              <a
                href="https://github.com/DevSnapz/web/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                MIT License
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-[#9CA3AF]">
          <div>
            © {new Date().getFullYear()} DevSnapz. Open Source Innovation.
          </div>
          <div className="inline-flex items-center gap-2 text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
            <span>Discover · Bridge · Collaborate</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
