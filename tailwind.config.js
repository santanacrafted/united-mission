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
      fontFamily: {
        winky: ['"Winky Rough"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

