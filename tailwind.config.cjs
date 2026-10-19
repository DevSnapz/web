module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
        gold: 'var(--gold)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        outfit: ['Outfit', 'sans-serif'],
        dmsans: ['Inter', 'DM Sans', 'sans-serif'],
        dmmono: ['JetBrains Mono', 'DM Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
