module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5d91e9",
        secondary: "#fafafa",
        accent: "#130c0d"
      },
    },
    fontFamily: {
      sans: ['"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'sans-serif']
    },
  },
  plugins: [],
};
