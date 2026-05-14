import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A2B4A',
          navyLight: '#2A3E5E',
          warm: '#8B7355',
          cream: '#FDFBF7',
          creamDark: '#F5F0EB',
          charcoal: '#2D2D2D',
          charcoalLight: '#4A4A4A',
          gold: '#B8966A',
          text: '#3C3C3C',
          textLight: '#6B6B6B',
          /* 次要說明：須在 cream (#FDFBF7) / 白底上達 WCAG AA（約 4.5:1） */
          textMuted: '#525252',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', '"Noto Sans TC"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config