/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#cc0000',
        'brand-dark': '#1a0000',
        'gold': {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b8860b',
          800: '#92400e',
          900: '#6b2d04',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-red-black': 'linear-gradient(135deg, #0d0000 0%, #2a0000 50%, #0d0000 100%)',
        'gradient-gold': 'linear-gradient(135deg, #b8860b 0%, #fbbf24 50%, #b8860b 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(30, 0, 0, 0.8) 0%, rgba(10, 0, 0, 0.95) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(184, 134, 11, 0.25)',
        'gold-lg': '0 8px 40px rgba(184, 134, 11, 0.3)',
        'red': '0 4px 20px rgba(139, 0, 0, 0.4)',
        'red-lg': '0 8px 40px rgba(139, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
