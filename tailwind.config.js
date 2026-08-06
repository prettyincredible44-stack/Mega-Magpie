/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cozy magpie brand palette
        cozy: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        magical: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        shimmer: {
          gold: '#fcd34d',
          deep: '#d97706',
          light: '#fef3c7',
        },
      },
      animation: {
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'shine-sweep': 'shine-sweep 3s ease-in-out infinite',
        'float-magical': 'float-magical 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'bounce-cozy': 'bounce-cozy 1.2s ease-in-out infinite',
        'shimmer-text': 'shimmer-text 3s linear infinite',
        'sparkle-burst': 'sparkle-burst 0.6s ease-out forwards',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        'shine-sweep': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'float-magical': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(252, 211, 77, 0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(252, 211, 77, 0.7)' },
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
      },
    },
  },
  plugins: [],
};
