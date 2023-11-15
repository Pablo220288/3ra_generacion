/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/html/utils/withMT")
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = withMT({
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        "backgroud-body": "#eae8fb",
        "backgroud-buttom": "#0d6c95",
        "backgroud-buttom-shadow": "#0d6c9569",
        "text-generation": "#0a5a7d",
        "background-alert": "#0000002c",
      },
      fontFamily: {
        pablo: ['"The Scientist", sans-serif', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
});
