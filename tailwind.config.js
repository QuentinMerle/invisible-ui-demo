/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Couleurs d'accent dynamiques pour LiquidStore
      colors: {
        accent: 'var(--color-accent, #1a1a1a)',
      },
      transitionDuration: {
        '600': '600ms',
      },
    },
  },
  plugins: [],
}
