module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@quibbble/boardgame/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "font-['coquette']",
    "text-blue-600",
    "max-w-xl",
    {
      pattern: /bg-(red|green|blue|yellow|orange|pink|purple|teal)-500/,
    },
    {
      pattern: /text-(red|green|blue|yellow|orange|pink|purple|teal)-500/,
    },
    {
      pattern: /border-(red|green|blue|yellow|orange|pink|purple|teal)-500/,
    },
    {
      pattern: /fill-(red|green|blue|yellow|orange|pink|purple|teal)-500/,
    },
  ]
}
