/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      custWhite: "#F8EDED",
      custOrange: "#FF8225",
      custBlack: "#173B45",
      white: colors.white,
      black: colors.black,
      primary1: colors.primary1,
      gray: colors.slate,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      pink: colors.pink,
    },

    extend: {},
  },
  plugins: [],
};
