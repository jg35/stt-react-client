module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in ease-in 300ms ",
        expand: "expand 400ms forwards",
        ticker: "ticker 2s linear infinite",
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
        ticker: {
          "0%": {
            transform: "translate3d(0, 0, 0)",
            visibility: "visible",
          },
          "100%": {
            transform: "translate3d(-100%, 0, 0)",
          },
        },
      },
    },
    colors: {
      offBlack: "#1e1e1e",
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
      google: "#4285f4",
      green: "#a9e292",
      facebook: "#3b5998",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
