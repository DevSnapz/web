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
    `text-xs font-semibold font-dmmono transition-colors ${
      isActive ? 'text-g' : 'text-ink1 hover:text-ink0'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg border px-4 py-2.5 text-xs text-left font-dmmono block ${
      isActive ? 'border-g bg-g/5 text-g' : 'border-ink3 text-ink1 hover:text-ink0 hover:bg-bg2'
    }`;

  return (
    <nav className="relative sticky top-0 z-50 bg-bg0/80 backdrop-blur-md border-b border-ink3">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-2 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-outfit font-extrabold text-[1.1rem] text-ink0 leading-tight bg-transparent border-none outline-none cursor-pointer"
        >
          Dev<span className="text-g">Snapz</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 sm:gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          
          <NavLink to="/explore" className={navLinkClass}>
            Explore Projects
          </NavLink>
          
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClass({ isActive })} flex items-center gap-1.5`}>
            Creator Hub
            {pendingNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            My Profile
          </NavLink>

          <button
            onClick={onOpenCreateWizard}
            className="text-[0.72rem] sm:text-xs font-semibold font-dmmono text-g-text bg-g/10 border border-g-dim rounded-md px-3.5 py-1.5 hover:bg-g/20 transition-all active:scale-95"
          >
            Share Project
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
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-ink1 hover:text-ink0 bg-g/5 border border-ink3/50"
          >
            <span className="text-xl leading-none">{open ? '×' : '≡'}</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute right-4 top-full z-40 mt-2 w-[min(260px,calc(100%-1rem))] overflow-hidden rounded-xl border border-ink3 bg-bg0 shadow-2xl transition-all duration-200 md:hidden ${
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
            Home
          </NavLink>
          
          <NavLink
            to="/explore"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            Explore Projects
          </NavLink>
          
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `rounded-lg border px-4 py-2.5 text-xs text-left font-dmmono flex items-center justify-between ${
                isActive ? 'border-g bg-g/5 text-g' : 'border-ink3 text-ink1 hover:text-ink0 hover:bg-bg2'
              }`
            }
          >
            <span>Creator Hub</span>
            {pendingNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={mobileNavLinkClass}
          >
            My Profile
          </NavLink>
          
          <button
            onClick={() => {
              setOpen(false);
              onOpenCreateWizard();
            }}
            className="rounded-lg border border-g-dim bg-g/10 px-4 py-2.5 text-xs font-bold text-center text-g-text"
          >
            Share Project
          </button>
        </div>
      </div>
    </nav>
  );
}
