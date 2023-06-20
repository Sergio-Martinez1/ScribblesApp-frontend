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
        purpleLight: '#36254B',
        purpleGray: '#281B38',
        purpleDark: '#1F152B',
        krispyPurple: '#931DF0',
        jacketBlue: '#2C41FF',
        lessPurple: '#7F18D0',
        hoverPurple: '#483164',
        squeezeRed: '#F0431D'
      },
    }
  },
  plugins: []
};

