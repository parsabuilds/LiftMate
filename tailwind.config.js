/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
