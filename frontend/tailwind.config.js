/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          white:  '#FFFFFF',
          black:  '#000000',
          muted:  '#F2F2F2',
          accent: '#FF3000',
          border: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        full: '0px',
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9' }],
        '11xl': ['12rem', { lineHeight: '0.85' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        swiss: '-0.03em',
      },
      transitionTimingFunction: {
        swiss: 'cubic-bezier(0.25, 0, 0.25, 1)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
      },
      gridTemplateColumns: {
        '8-4': '2fr 1fr',
        '7-5': '7fr 5fr',
        '5-7': '5fr 7fr',
        '4-8': '1fr 2fr',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        112: '28rem',
        128: '32rem',
      },
      boxShadow: {
        none: 'none',
      },
      animation: {
        'slide-up': 'slideUp 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'color-snap': 'colorSnap 0.15s linear',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
