module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    safelist: [
      /^[.\S]*google$/,
      /^[.\S]*green$/,
      /^[.\S]*facebook$/,
      /^[.\S]*facebookMessenger$/,
      /^[.\S]*whatsapp$/,
      /^[.\S]*gmail$/,
      /^[.\S]*twitter$/,
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      animation: {
        "fade-in": "fade-in ease-in 300ms ",
        // TODO - refactor animate-fade-ins with fade-outs
        "fade-out": "fade-out ease-out 300ms forwards",
        "slide-in": "slide-down ease-in 300ms forwards",
        "slide-out": "slide-up ease-out 300ms forwards",

        "slide-in-left":
          "slide-in-left .65s cubic-bezier(0.230, 1.000, 0.320, 1.000) both",
        "slide-out-right":
          "slide-out-right 0.65s cubic-bezier(0.755, 0.050, 0.855, 0.060) both",
        expand: "expand 400ms forwards",
        ticker: "ticker 2s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "100%": { opacity: "0" },
          "0%": { opacity: "1" },
        },
        "slide-down": {
          "0%": { top: "-25rem" },
          "100%": { top: "0rem" },
        },
        "slide-up": {
          "100%": { top: "-25rem" },
          "0%": { top: "0rem" },
        },
        "slide-out-right": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateX(400px)",
          },
        },
        "slide-in-left": {
          "0%": {
            transform: "translateX(100px)",
          },
          "100%": {
            transform: "translateX(0)",
            filter: "blur(0)",
            opacity: 1,
          },
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
      minWidth: {
        0: "0",
        // For fragment scroll (need to be slightly bigger than stated)
        "f1/3": "35",
        "f1/2": "52%",
        "f1/4": "26.5",
        full: "100%",
      },
      height: {
        "fit-content": "fit-content",
      },
      gridTemplateColumns: {
        14: "repeat(14, minmax(0, 1fr))",
      },
    },
    colors: {
      offBlack: "#1e1e1e",
      black: "#000000",
      lightBlack: "#3E3E3E",
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
      green: "#9fe682",
      successGreen: "#79b727",
      facebook: "#3b5998",
      orange: "orange",
      facebookMessenger: "#0076fb",
      whatsapp: "#25D366",
      gmail: "#EA4335",
      twitter: "#1DA1F2",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
