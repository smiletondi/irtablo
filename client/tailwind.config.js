module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "#FFF",
      blackWhite: "#fffffe",
      seashellPeach: "#fff3ec",
      black: "#000",
      azureWeb: "#F9EBDE",
      kabul: "#55423D",
      pizazz: "#FF8906",
      hawkesBlue: "#DBE5FE",
      cocoaBrown: "#271C19",
      waxFlower: "#FFC0AD",
      cinderella: "#FBE3DC",
      woodyBrown: "#3E2E2D",
      carissma: "#e78fb3",
      trendyPink: "#9656a1",
    },
    screens: {
      sm: "320px",
    },
    extend: {
      fontFamily: {
        risque: ["Risque", "cursive"],
        roboto: ["Roboto", "sans-serif"],
      },
      fontSize: {
        "2.1xl": "1.563rem",
        "3.3xl": "1.953rem",
        "4.3xl": "2.441rem",
      },
      boxShadow: {
        "3xl": "0 35px 60px -16px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
