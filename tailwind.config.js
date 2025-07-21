/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        'google': ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'slideUp': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      colors: {
        google: {
          blue: '#4285f4',
          red: '#ea4335',
          yellow: '#fbbc04',
          green: '#34a853',
        }
      },
      boxShadow: {
        'google': '0 2px 10px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
        'google-lg': '0 8px 25px 0 rgba(60,64,67,.3), 0 4px 11px 4px rgba(60,64,67,.15)',
      }
    },
  },
  plugins: [],
}
