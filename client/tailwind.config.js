/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Noto Serif Bengali"', 'serif'],
                sans: ['"Noto Sans Bengali"', 'sans-serif'],
            },
            colors: {
                'detective-black': '#1a1a1a',
                'detective-dark': '#2d2d2d',
                'gold-accent': '#d4af37',
                'paper-white': '#f5f5f5',
            }
        },
    },
    plugins: [],
}
