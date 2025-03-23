/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6d28d9',    // Deep purple
        accent: '#ef4444',     // Vibrant red
        highlight: '#eab308',  // Warm yellow
        neutral: '#1f2937',    // Dark slate
        'neutral-light': '#9ca3af', // Light slate
        'card-bg': '#f9fafb',  // Off-white
        'glass-bg': 'rgba(255, 255, 255, 0.15)',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(109, 40, 217, 0.3)',
      },
      backgroundImage: {
        'grey-gradient': 'linear-gradient(145deg, #d1d5db 0%, #374151 100%)',
        'button-gradient': 'linear-gradient(90deg, #6d28d9 0%, #ef4444 100%)',
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 1.5s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(109, 40, 217, 0.2)' },
          '50%': { boxShadow: '0 0 15px rgba(109, 40, 217, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};