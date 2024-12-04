/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1500px',
    },
    spacing: {
      '1': '.5rem',
      '1.5': '1.rem',
      '2': '2rem',
      '3': '3rem',
      '4': '4rem',
      '5': '5rem',
      '6': '5rem'
    },
    extend: {
      fontSize: {
        'base': '65%', // Sets base font size
      },
      fontFamily: {
        custom: ['Oxygen', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out', // 1s is the duration of the animation
      },
      spacing: {
        '1.5': '1.5rem',
      },
      fontSize: {
        base: '1rem'
      },
      colors: {
        'color1': '#1e293b',
        'color2': '#cd9042',
        'color3': '#F0F0F0'
      },
    },
  },
  plugins: [],
}

