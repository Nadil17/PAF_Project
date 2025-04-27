/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Blues for primary buttons and links
        blue: {
          600: '#0066ff', // Primary button color
          700: '#0055cc', // Button hover
        },
        // Orange for upvote buttons
        orange: {
          500: '#ff6600', // Upvoted color
        },
        // Grays for borders, backgrounds, etc.
        gray: {
          50: '#f9f9f9',  // Light background (answer background)
          100: '#f5f5f5', // Login prompt background
          200: '#eee',    // Borders
          300: '#ddd',    // Input borders
          500: '#777',    // Meta text
          600: '#666',    // Secondary text
          800: '#333',    // Primary text
        },
        // Reds for error messages
        red: {
          50: '#ffebee',  // Error background
          600: '#cc0000', // Error text
          700: '#c62828', // Error border
        }
      },
      minWidth: {
        '10': '40px',    // Width for voting column
      },
      minHeight: {
        '40': '150px',   // Min height for textareas
      }
    },
  },
  plugins: [],
}