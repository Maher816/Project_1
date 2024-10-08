/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.{ejs, js}`],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
  daisyui: {
    themes: ['cupcake'],
  },
}

