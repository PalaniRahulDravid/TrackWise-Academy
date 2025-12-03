/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',      // Extra small devices (large phones)
        'sm': '640px',      // Small devices (tablets)
        'md': '768px',      // Medium devices (small laptops)
        'lg': '1024px',     // Large devices (laptops/desktops)
        'xl': '1280px',     // Extra large devices (large desktops)
        '2xl': '1536px',    // 2X Extra large devices (larger desktops)
        '3xl': '1920px',    // 3X Extra large devices (ultra-wide)
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
