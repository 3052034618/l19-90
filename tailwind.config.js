/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#0F1923',
          card: '#111B27',
          border: '#1E2D3D',
          accent: '#00E5C7',
          danger: '#FF4757',
          warning: '#FFA502',
          info: '#3498DB',
          muted: '#8B9DAF',
          dim: '#4A5A6A',
        },
      },
    },
  },
  plugins: [],
};
