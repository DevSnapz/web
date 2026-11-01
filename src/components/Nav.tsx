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
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const location = useLocation();

  const handleCommunityClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('community');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-sans px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
      isActive
        ? 'text-[#f0f6fc] font-semibold bg-[#21262d] border border-[#3d444d]'
        : 'text-[#9198a1] hover:text-[#f0f6fc] hover:bg-[#21262d]/60 font-medium'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#010409] border-b border-[#3d444d] h-14 flex items-center transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-3">
        
        {/* Left Side: GitHub Octocat Logo & DevSnapz Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group outline-none cursor-pointer text-[#f0f6fc] hover:text-[#58a6ff] transition-colors"
            title="DevSnapz GitHub Workspace"
          >
            {/* GitHub Invertocat SVG Mark */}
            <svg height="30" viewBox="0 0 24 24" width="30" className="fill-current" aria-hidden="true">
              <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.272-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z" />
            </svg>
            <span className="font-sans font-semibold text-sm tracking-tight text-[#f0f6fc] flex items-center gap-1.5">
              <span>DevSnapz</span>
              <span className="text-[#656c76]">/</span>
              <span className="text-[#9198a1] text-xs font-normal">student-network</span>
            </span>
          </Link>

          {/* GitHub-style Global Search Box */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/explore"
              className="flex items-center justify-between w-60 h-7 px-2.5 text-xs bg-[#151b23] border border-[#3d444d] rounded-md text-[#9198a1] hover:border-[#58a6ff] hover:text-[#f0f6fc] transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 fill-current text-[#9198a1]" viewBox="0 0 16 16">
                  <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
                </svg>
                <span>Type <kbd className="px-1 py-0.2 bg-[#21262d] border border-[#3d444d] rounded text-[10px] text-[#f0f6fc]">/</kbd> to search</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/explore" className={navLinkClass}>
            <span>Explore</span>
          </NavLink>
          
          <NavLink to="/dashboard" className={navLinkClass}>
            <span>Pull requests</span>
            {pendingNotifications > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#1f6feb] text-white text-[10px] font-mono font-bold">
                {pendingNotifications}
              </span>
            )}
          </NavLink>

          <NavLink to="/explore" end className={navLinkClass}>
            <span>Issues & Gaps</span>
          </NavLink>

          <Link
            to="/#community"
            onClick={handleCommunityClick}
            className="text-xs font-sans font-medium px-3 py-1.5 rounded-md text-[#9198a1] hover:text-[#f0f6fc] hover:bg-[#21262d]/60 transition-colors"
          >
            Discussions
          </Link>
        </div>

        {/* Right Action Icons (GitHub Top-Right Toolbar) */}
        <div className="flex items-center gap-2">
          
          {/* GitHub "+" Create Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPlusMenuOpen(!plusMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#3d444d] rounded-md shadow-xs transition-colors cursor-pointer"
              title="Create new..."
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
                <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" />
              </svg>
              <span className="text-[10px] leading-none">▾</span>
            </button>

            {plusMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 bg-[#151b23] border border-[#3d444d] rounded-md shadow-xl py-1 z-50 text-xs text-[#f0f6fc]"
                onMouseLeave={() => setPlusMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPlusMenuOpen(false);
                    onOpenCreateWizard();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#1f6feb] hover:text-white flex items-center gap-2"
                >
                  <span>📁</span>
                  <span>New repository</span>
                </button>
                <Link
                  to="/explore"
                  onClick={() => setPlusMenuOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-[#1f6feb] hover:text-white flex items-center gap-2"
                >
                  <span>⚡</span>
                  <span>Find open skill gaps</span>
                </Link>
              </div>
            )}
          </div>

          {/* GitHub Notification Bell */}
          <Link
            to="/dashboard"
            className="relative p-1.5 rounded-md text-[#9198a1] hover:text-[#f0f6fc] hover:bg-[#21262d] border border-[#3d444d] bg-[#21262d]/60 transition-colors"
            title="Notifications"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 1.985-1.75c.001-.014.002-.028.002-.042H6.013A2 2 0 0 0 8 16ZM8 1.5a4.5 4.5 0 0 0-4.5 4.5v2.879c0 .546-.217 1.07-.604 1.456L1.854 11.378A.75.75 0 0 0 2.384 12.65h11.232a.75.75 0 0 0 .53-1.272l-1.042-1.043a2.06 2.06 0 0 1-.604-1.456V6A4.5 4.5 0 0 0 8 1.5Z" />
            </svg>
            {pendingNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#1f6feb] ring-2 ring-[#010409]" />
            )}
          </Link>

          {/* Theme Toggle (Dark Tritanopia) */}
          <ThemeToggle />

          {/* User Profile Avatar with Caret */}
          <Link
            to="/profile"
            className="flex items-center gap-1 p-0.5 rounded-md hover:bg-[#21262d] transition-colors"
            title="Your GitHub Profile"
          >
            <img
              src="https://avatars.githubusercontent.com/u/174297688?s=96&v=4"
              alt="Profile"
              className="w-6 h-6 rounded-full ring-1 ring-[#3d444d]"
            />
            <span className="text-[10px] text-[#9198a1] leading-none hidden sm:inline">▾</span>
          </Link>

          {/* Mobile hamburger menu */}
          <button
            type="button"
            aria-label="Open mobile menu"
            onClick={() => setOpen(!open)}
            className="md:hidden p-1.5 rounded-md text-[#9198a1] hover:text-[#f0f6fc] bg-[#21262d] border border-[#3d444d]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
              <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#151b23] border-b border-[#3d444d] p-4 flex flex-col gap-2 md:hidden z-50 text-xs">
          <NavLink
            to="/explore"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-md hover:bg-[#21262d] text-[#f0f6fc]"
          >
            Explore Repositories
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-md hover:bg-[#21262d] text-[#f0f6fc] flex justify-between items-center"
          >
            <span>Pull requests</span>
            {pendingNotifications > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#1f6feb] text-white text-[10px] font-bold">
                {pendingNotifications}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-md hover:bg-[#21262d] text-[#f0f6fc]"
          >
            Your Profile
          </NavLink>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenCreateWizard();
            }}
            className="text-left px-3 py-2 rounded-md bg-[#1f6feb] text-white font-semibold mt-2"
          >
            + New Repository
          </button>
        </div>
      )}
    </nav>
  );
}
