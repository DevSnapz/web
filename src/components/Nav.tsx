import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface NavProps {
  onOpenCreateWizard: () => void;
  pendingNotifications: number;
}

export default function Nav({
  onOpenCreateWizard,
  pendingNotifications,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleCommunityClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('community');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-sans px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
      isActive
        ? 'text-[#635BFF] bg-[#F3F1FF] border border-[#635BFF]/25 font-semibold shadow-xs dark:text-[#58a6ff] dark:bg-[rgba(56,139,253,0.15)] dark:border-[#1f6feb]'
        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC] border border-transparent font-medium dark:text-[#9198a1] dark:hover:text-[#f0f6fc] dark:hover:bg-[#1c2128]'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl border px-4 py-2.5 text-xs text-left font-sans flex items-center justify-between transition-all ${
      isActive
        ? 'border-[#635BFF]/30 bg-[#F3F1FF] text-[#635BFF] font-semibold dark:border-[#1f6feb] dark:bg-[rgba(56,139,253,0.15)] dark:text-[#58a6ff]'
        : 'border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC] dark:border-[#3d444d] dark:text-[#9198a1] dark:hover:text-[#f0f6fc] dark:hover:bg-[#1c2128]'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#151b23]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#3d444d] h-[68px] sm:h-[72px] flex items-center transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 w-full flex items-center justify-between gap-4">
        
        {/* Brand Lockup: DevSnapz. with Tritanopia-safe coral dot */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 group outline-none cursor-pointer"
        >
          <span className="font-sans font-extrabold text-[1.25rem] sm:text-[1.35rem] tracking-tight text-[#111827] dark:text-[#f0f6fc]">
            DevSnapz<span className="text-[#F9735B] dark:text-[#ff7b72]">.</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5">
          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>
          
          <NavLink to="/explore" end className={navLinkClass}>
            Projects
          </NavLink>
          
          <Link
            to="/#community"
            onClick={handleCommunityClick}
            className="text-xs font-sans font-medium px-3.5 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC] dark:text-[#9198a1] dark:hover:text-[#f0f6fc] dark:hover:bg-[#1c2128] transition-all"
          >
            Community
          </Link>
        </div>

        {/* Far Right Actions: Workspace, Profile & Share Project CTA */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/dashboard" className={navLinkClass} title="Creator Workspace">
            <span>Workspace</span>
            {pendingNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F9735B] dark:bg-[#ff7b72] animate-pulse" />
            )}
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            <span>Profile</span>
          </NavLink>

          <button
            onClick={onOpenCreateWizard}
            className="text-xs font-semibold font-sans text-white bg-[#635BFF] hover:bg-[#5246C9] dark:bg-[#1f6feb] dark:hover:bg-[#2a7aef] rounded-lg px-4 py-2 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Share Project</span>
          </button>
          
          <ThemeToggle />
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-[#6B7280] hover:text-[#111827] bg-[#F7F8FC] border border-[#E5E7EB] dark:bg-[#151b23] dark:border-[#3d444d] dark:text-[#9198a1] dark:hover:text-[#f0f6fc]"
          >
            <span className="text-lg leading-none">{open ? '×' : '≡'}</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute right-4 top-full z-40 mt-2 w-[min(300px,calc(100%-2rem))] overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-[#3d444d] bg-white dark:bg-[#151b23] shadow-xl transition-all duration-200 md:hidden ${
          open ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        <div className="flex flex-col gap-2 p-3.5">
          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            <span>Home</span>
          </NavLink>
          
          <NavLink
            to="/explore"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            <span>Explore Projects</span>
          </NavLink>

          <Link
            to="/#community"
            onClick={(e) => {
              setOpen(false);
              handleCommunityClick(e);
            }}
            className="rounded-xl border border-[#E5E7EB] dark:border-[#3d444d] px-4 py-2.5 text-xs text-left font-sans text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FC] dark:text-[#9198a1] dark:hover:text-[#f0f6fc] dark:hover:bg-[#1c2128] transition-all"
          >
            <span>Community</span>
          </Link>

          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            <span>Workspace</span>
            {pendingNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F9735B] dark:bg-[#ff7b72] animate-pulse" />
            )}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            <span>Profile</span>
          </NavLink>
          
          <button
            onClick={() => {
              setOpen(false);
              onOpenCreateWizard();
            }}
            className="rounded-xl bg-[#635BFF] hover:bg-[#5246C9] dark:bg-[#1f6feb] dark:hover:bg-[#2a7aef] px-4 py-2.5 text-xs font-bold text-center text-white shadow-sm mt-1 transition-all"
          >
            + Share Project
          </button>
        </div>
      </div>
    </nav>
  );
}
