/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        varela: ['Varela Round', 'sans-serif'],
      },
      colors: {
        'default-orange': '#E46C15',
        'default-gray': '#C1C1C1',
        'default-red': '#E73131',
      },
    },
  },
  plugins: [],
};
