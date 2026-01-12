/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f0ff',
        'neon-cyan': '#00ffff',
        'neon-purple': '#b794f6',
        'glass-dark': 'rgba(15, 23, 42, 0.8)',
        'border': '#1e293b',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(183, 148, 246, 0.5)',
        'glow': '0 0 40px rgba(0, 240, 255, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 30px rgba(0, 240, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}

