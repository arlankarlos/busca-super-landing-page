/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',        // Procura classes no arquivo index.html e outros HTML na raiz
    './assets/js/*.js', // Procura classes nos arquivos JS na pasta assets/js
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
