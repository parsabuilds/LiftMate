/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'timer-flash': 'timerFlash 0.6s ease-in-out 4',
      },
      keyframes: {
        timerFlash: {
          '0%, 100%': { opacity: '0' },
          '40%, 60%': { opacity: '1' },
        },
      },
      colors: {
        bg: '#0F172A',
        card: '#1E293B',
        primary: '#3B82F6',
        success: '#10B981',
        text: '#F8FAFC',
        muted: '#94A3B8',
        border: '#334155',
      },
    },
  },
  plugins: [],
};
