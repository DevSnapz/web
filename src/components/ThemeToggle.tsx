import React, { useEffect, useState } from 'react';

function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme') || localStorage.getItem('devsnapz_theme');
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-color-mode', 'dark');
      root.setAttribute('data-dark-theme', 'dark_tritanopia');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-color-mode', 'light');
      root.removeAttribute('data-dark-theme');
    }
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('devsnapz_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      type="button"
      aria-label={theme === 'light' ? 'Switch to GitHub Dark Tritanopia' : 'Switch to Light theme'}
      title={theme === 'light' ? 'Switch to GitHub Dark Tritanopia' : 'Switch to Light theme'}
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#E5E7EB] hover:border-[#635BFF]/30 bg-[#F7F8FC] hover:bg-white text-[#6B7280] hover:text-[#111827] dark:bg-[#151b23] dark:border-[#3d444d] dark:text-[#9198a1] dark:hover:text-[#f0f6fc] dark:hover:bg-[#1c2128] transition-all shadow-xs cursor-pointer"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-4 h-4 text-[#6B7280] hover:text-[#635BFF]" />
      ) : (
        <SunIcon className="w-4 h-4 text-[#ff7b72]" />
      )}
    </button>
  );
}
