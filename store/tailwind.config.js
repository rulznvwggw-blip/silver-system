/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          bg: '#090d16',
          card: '#0f172a',
          cardHover: '#1e293b',
          border: '#1e293b',
          text: '#f8fafc',
          muted: '#94a3b8',
        },
        cozy: {
          950: '#100a07',
          900: '#160e0a',
          850: '#1e130d',
          800: '#251811',
          750: '#2f1f17',
          700: '#3d281e',
          600: '#52372a',
          500: '#d97736',
          400: '#e68545',
          300: '#f59e0b',
          200: '#fbbf24',
          100: '#f3eee6',
          50: '#fdfbf7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'steam-1': 'steamWave1 2.2s infinite ease-out',
        'steam-2': 'steamWave2 2.5s infinite ease-out 0.4s',
        'ambient-pulse': 'ambientPulse 3s infinite ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        steamWave1: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '30%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-24px) scaleX(1.3) rotate(-5deg)', opacity: '0' },
        },
        steamWave2: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '35%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-28px) scaleX(1.4) rotate(6deg)', opacity: '0' },
        },
        ambientPulse: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(217, 119, 54, 0.3), 0 0 50px rgba(217, 119, 54, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(217, 119, 54, 0.6), 0 0 80px rgba(245, 158, 11, 0.25)' },
        },
      }
    },
  },
  plugins: [],
};
