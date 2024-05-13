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
        purpleDark: '#1F152B',
        purpleGray: '#281B38',
        purpleLight: '#36254B',
        lessPurple: '#7F18D0',
        hoverPurple: '#483164',

        lavandaDark: '#e8e1ed',
        lavandaGray: '#fff',
        lavandaLight: '#e3dfe6',
        lessLavanda: '#c091e6',
        hoverLavanda: '#d4c1e3',

        krispyPurple: '#931DF0',
        jacketBlue: '#2C41FF',
        squeezeRed: '#F0431D',
      },
    }
  },
  darkMode: 'class',
  plugins: []
};

