/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Reactのファイルを対象にする
  ],
  theme: {
    extend: {
      colors: {
        "white-90": "rgba(255, 255, 255, 0.9)",
      },
    }, // 必要に応じてカスタマイズ
  },
  plugins: [],
};
