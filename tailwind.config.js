/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-custom': {
          /* Firefox */
          'scrollbar-width': 'thin',
          'scrollbar-color': '#cbd5e1 #f1f5f9',
        },
        '.scrollbar-custom::-webkit-scrollbar': {
          width: '8px',
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          'border-radius': '4px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          'border-radius': '4px',
          'min-height': '20px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb:hover': {
          background: '#94a3b8',
        },
        '.scrollbar-custom::-webkit-scrollbar-button': {
          display: 'none',
        },
        '.scrollbar-custom::-webkit-scrollbar-corner': {
          background: 'transparent',
        },
        '.scrollbar-always': {
          'overflow-y': 'scroll !important',
        }
      })
    }
  ],
} 