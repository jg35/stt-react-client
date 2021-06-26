module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in ease-in 300ms ",
        expand: "expand 400ms forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        expand: {
          "0%": { opacity: "0" },
          "100%": {
            opacity: "1",
            transform: "scale(110%)",
            boxShadow: "1px 1px 12px rgb(0, 0, 0, .15)",
          },
        },
      },
    },
    colors: {
      black: "#000000",
      gray: "#BFBFBF",
      lightGray: "#F2F2F2",
      lightestGray: "#F8F8F8",
      offWhite: "#fbfbfb",
      white: "#FFFFFF",
      blue: "#3F5D7C",
      lightBlue: "#EBEEF2",
      gold: "#8B866E",
      lightGold: "#F3F3F0",
      darkGray: "#666666",
      red: "#ff6a66",
      transparent: "transparent",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
