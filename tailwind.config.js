/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand: dark teal
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Secondary accent: amber/gold
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Surface tones (green-slate)
        felt: {
          900: '#0a1f1c',
          800: '#0f2924',
          700: '#163530',
          600: '#1d433d',
          500: '#245148',
        },
        // Keep cozy (orange) for coin icon
        cozy: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        magical: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        shimmer: {
          gold: '#fcd34d',
        },
      },
      animation: {
        'float-magical': 'float-magical 3s ease-in-out infinite',
        'bounce-cozy': 'bounce-cozy 1.2s ease-in-out infinite',
        'shimmer-text': 'shimmer-text 3s linear infinite',
        'sparkle-burst': 'sparkle-burst 0.6s ease-out forwards',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'card-flip': 'card-flip 0.3s ease-out',
        'card-move': 'card-move 0.15s ease-out',
      },
      keyframes: {
        'float-magical': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        'bounce-cozy': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer-text': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'sparkle-burst': {
          '0%': { opacity: '1', transform: 'scale(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'scale(2) rotate(180deg)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(45,212,191,0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(45,212,191,0.6)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'card-flip': {
          '0%': { transform: 'rotateY(90deg) scale(0.9)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg) scale(1)', opacity: '1' },
        },
        'card-move': {
          '0%': { transform: 'scale(1.05)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
        'card-selected': '0 0 0 2px #2dd4bf, 0 4px 12px rgba(45,212,191,0.4)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
