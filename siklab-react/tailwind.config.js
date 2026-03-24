/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff6b35',
          50: '#fff9f7',
          100: '#fffbf7',
          200: '#ff8c42',
          300: '#ff7a3e',
          400: '#ff6b35',
          500: '#ff6b35',
          600: '#d94a2f',
          700: '#c43d25',
          800: '#a0311e',
          900: '#7d2517',
        },
        accent: '#d94a2f',
        charcoal: '#2d2416',
        warmBrown: '#6b5d50',
        warmCard: '#fffbf7',
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 2px 8px rgba(255, 107, 53, 0.2)',
        'warm-lg': '0 4px 12px rgba(255, 107, 53, 0.25)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
