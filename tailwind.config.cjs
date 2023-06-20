/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sansSerif: ['Source Sans Pro', 'sans-serif'],
      mono: ['Source Code Pro', 'monospace'],
      handwriting: ['Kalam', 'cursive']
    },
    extend: {
      colors: {
        purpleDark: '#170127',
        purpleWine: '#300b3f',
        purpleScarf: '#420c58',
        purpleLight: '#a15baa',
        pinkSolid: '#e3a4a8',
        yellowFizz: '#dfb77d',
      },
    }
  },
  plugins: []
};

