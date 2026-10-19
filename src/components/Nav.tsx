import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-sans px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
      isActive
        ? 'text-ink0 bg-bg2 border border-ink3 font-semibold shadow-sm'
        : 'text-ink1 hover:text-ink0 hover:bg-bg2/60 border border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl border px-4 py-2.5 text-xs text-left font-sans flex items-center justify-between transition-all ${
      isActive
        ? 'border-g/40 bg-g/10 text-g font-semibold shadow-sm'
        : 'border-ink3/70 text-ink1 hover:text-ink0 hover:bg-bg2'
    }`;

  return (
    <nav className="relative sticky top-0 z-50 bg-bg0/85 backdrop-blur-xl border-b border-ink3">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group outline-none cursor-pointer"
        >
          <span className="font-outfit font-extrabold text-[1.15rem] tracking-tight text-ink0 transition-colors">
            Dev<span className="text-g">Snapz</span>
          </span>
          <span className="hidden sm:inline-flex items-center text-[0.62rem] font-mono tracking-wider uppercase bg-g/10 text-g border border-g-dim px-2 py-0.5 rounded-full font-semibold">
            Studio
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          
          <NavLink to="/explore" className={navLinkClass}>
            Explore Projects
          </NavLink>
          
          <NavLink to="/dashboard" className={navLinkClass}>
            <span>Creator Hub</span>
            {pendingNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            )}
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            My Profile
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenCreateWizard}
            className="text-xs font-semibold font-sans text-white bg-g hover:bg-g-dim border border-g-dim rounded-lg px-3.5 py-1.5 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
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
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-ink1 hover:text-ink0 bg-bg2 border border-ink3"
          >
            <span className="text-lg leading-none">{open ? '×' : '≡'}</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute right-4 top-full z-40 mt-2 w-[min(280px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-ink3 bg-bg1/95 backdrop-blur-xl shadow-2xl transition-all duration-200 md:hidden ${
          open ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        <div className="flex flex-col gap-2 p-3">
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
          
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            <span>Creator Hub</span>
            {pendingNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            )}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            <span>My Profile</span>
          </NavLink>
          
          <button
            onClick={() => {
              setOpen(false);
              onOpenCreateWizard();
            }}
            className="rounded-xl border border-g-dim bg-g px-4 py-2.5 text-xs font-bold text-center text-white shadow-sm mt-1"
          >
            + Share Project
          </button>
        </div>
      </div>
    </nav>
  );
}
