/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'purple-light': '#3D3356',
        'purple-dark': '#312945'
      }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#3D3356',

          secondary: '#d926a9',

          accent: '#1fb2a6',

          neutral: '#2a323c',

          'base-100': '#1d232a',

          info: '#3abff8',

          success: '#36d399',

          warning: '#fbbd23',

          error: '#f87272'
        }
      }
    ]
  },
  plugins: [require('daisyui')]
})
