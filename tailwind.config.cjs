module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme variables mapping
        bg0: 'var(--bg0)',
        bg1: 'var(--bg1)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        bg4: 'var(--bg4)',
        ink0: 'var(--ink0)',
        ink1: 'var(--ink1)',
        ink2: 'var(--ink2)',
        ink3: 'var(--ink3)',
        g: 'var(--g)',
        'g-dim': 'var(--g-dim)',
        'g-text': 'var(--g-text)',
        gold: 'var(--gold)',

        // DevSnapz Studio Explicit Light Tokens
        'studio-bg': '#F7F8FC',
        'studio-card': '#FFFFFF',
        'studio-border': '#E5E7EB',
        'studio-primary': '#635BFF',
        'studio-hover': '#5246C9',
        'studio-accent': '#F9735B',
        'studio-soft': '#F3F1FF',
        'studio-ink': '#111827',
        'studio-secondary': '#6B7280',
        'studio-muted': '#9CA3AF',
        'studio-success': '#17936C',
        'studio-success-soft': '#ECFDF5',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        outfit: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        dmsans: ['Inter', 'DM Sans', 'sans-serif'],
        dmmono: ['JetBrains Mono', 'DM Mono', 'monospace'],
      },
      borderRadius: {
        'studio-card': '16px',
        'studio-button': '10px',
        'studio-input': '10px',
      },
      boxShadow: {
        'studio-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'studio-card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'studio-hover': '0 10px 15px -3px rgba(99, 91, 255, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
