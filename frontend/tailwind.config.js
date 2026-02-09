/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        nova: {
          primary: '#6366f1',
          dark: '#0f172a',
          accent: '#22d3ee',
        },
      },
    },
  },
  plugins: [],
}
