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
          50: '#fff9e6',
          100: '#fef0c3',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b8860b',
          800: '#92400e',
          900: '#6b2d04',
        },
        'maroon': {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#f9cece',
          300: '#f3a3a3',
          400: '#e86b6b',
          500: '#d94040',
          600: '#c42a2a',
          700: '#a32121',
          800: '#871f1f',
          900: '#711f1f',
          950: '#3d0c0c',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cinzel: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        'cinzel-decorative': ['"Cinzel Decorative"', '"Cinzel"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-red-black': 'linear-gradient(135deg, #0d0000 0%, #2a0000 50%, #0d0000 100%)',
        'gradient-gold': 'linear-gradient(135deg, #b8860b 0%, #fbbf24 50%, #b8860b 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(30, 0, 0, 0.8) 0%, rgba(10, 0, 0, 0.95) 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #0a0000 0%, #1a0505 25%, #0d0000 50%, #150808 75%, #0a0000 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'entrance-up': 'entrance-up 0.8s ease-out forwards',
        'sparkle': 'sparkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(184, 134, 11, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(184, 134, 11, 0.3)' },
        },
        'entrance-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(184, 134, 11, 0.25)',
        'gold-lg': '0 8px 40px rgba(184, 134, 11, 0.3)',
        'gold-glow': '0 0 30px rgba(184, 134, 11, 0.2), 0 0 60px rgba(184, 134, 11, 0.1)',
        'red': '0 4px 20px rgba(139, 0, 0, 0.4)',
        'red-lg': '0 8px 40px rgba(139, 0, 0, 0.5)',
        'luxury': '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(184, 134, 11, 0.08)',
        'card-hover': '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(184, 134, 11, 0.15)',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
  plugins: [],
}
