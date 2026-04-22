/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        tide: "#0f766e",
        ember: "#f97316",
        mist: "#e2e8f0"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(8,17,31,0.25)"
      }
    }
  },
  plugins: []
};
