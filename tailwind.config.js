// tailwind.config.js — "Living Sky" design tokens
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A1120',
          deep: '#070C18',
        },
        mist: 'rgba(226,236,248,0.68)',
        horizon: {
          DEFAULT: '#7CC4FF',
          soft: '#BFDCFF',
          dim: '#3D8FE0',
        },
        status: {
          good: '#4ADE80',
          caution: '#FBBF24',
          alert: '#F87171',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 34px rgba(3,9,22,0.5)',
        pop: '0 16px 48px rgba(3,9,22,0.6)',
      },
      borderRadius: {
        card: '20px',
        xl2: '28px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
