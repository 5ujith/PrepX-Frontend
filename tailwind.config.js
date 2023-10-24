/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'login-bg-img': "url('/public/images/emerald-background.jpg')",
        'blog-img': "url('/public/images/blog-bg.jpg')"
      })
    },
  },
  plugins: [],
}