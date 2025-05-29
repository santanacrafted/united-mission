/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    {
      pattern: /text-\[#(?:[0-9a-fA-F]{3}){1,2}\]/, // matches text-[#xxxxxx]
    },
    {
      pattern: /hover:text-\[#(?:[0-9a-fA-F]{3}){1,2}\]/, // matches hover:text-[#xxxxxx]
    },
  ],
  theme: {
    extend: {
      screens: {
        mdx: '900px', // custom 900px breakpoint
      },
      height: {
        'full-plus-120': 'calc(100% + 120px)',
      },
      fontFamily: {
        AdventPro: ['"AdventPro"', 'TitiliumWeb', 'sans-serif'],
        TitiliumWeb: ['"TitiliumWeb"', 'AdventPro', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out',
      },
    },
  },
  plugins: [],
}

