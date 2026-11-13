/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f0f9fa',
          100: '#def1f5',
          200: '#bee3ec',
          300: '#8ecfde',
          400: '#55b5cc',
          500: '#189ab4', // CarePlus main teal/cyan
          600: '#137d94',
          700: '#146578',
          800: '#175362',
          900: '#184653',
        },
        skybg: '#f1f8fa',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(24, 154, 180, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 8px 24px -4px rgba(15, 76, 92, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'floating': '0 20px 40px -10px rgba(19, 125, 148, 0.12)',
      }
    },
  },
  plugins: [],
}
