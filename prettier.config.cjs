/** @type {import("prettier").Config} */
const config = {
    printWidth: 110,
    plugins: [
      "prettier-plugin-organize-attributes",
      "@trivago/prettier-plugin-sort-imports",
      "prettier-plugin-tailwindcss",
    ],
    tailwindConfig: "./tailwind.config.js",
    tailwindFunctions: ["usePassThrough"],
  };
  
  module.exports = config;