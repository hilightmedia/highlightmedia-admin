/** @type {import('tailwindcss').Config} */
import { text } from "stream/consumers";
import tailwindcssAnimate from "tailwindcss-animate";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // Add this if using Next.js App Router
  ],
  theme: {
    extend: {
      colors: {
        primary_text: "#000000",
        secondary_text: "#747474",
        orange_text: "#EA6535",
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(180deg, #FFA483 0%, #EA6535 100%)",
        "gold-orange-text":
          "linear-gradient(271.89deg, #FAB80A 22.06%, #EA6535 116.84%)",
          "button-gradient": "linear-gradient(91.76deg, #EA6535 0%, #FB9B79 100%)"
      },
      boxShadow: {
        "custom-dark": "11px 2px 29.4px 0px #2C2C2C26",
      },
      backgroundColor: {
        primary: "#EA6535",
      },
      borderColor: {
        primary: "#EA6535",
        secondary: "#747474",
      },
      screens: {
        xs: "0px",
        // => @media (min-width: 0px) { ... }
        sm: "576px",
        // => @media (min-width: 576px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "992px",
        // => @media (min-width: 992px) { ... }

        xl: "1200px",
        // => @media (min-width: 1200px) { ... }

        "2xl": "1400px",
        // => @media (min-width: 1600px) { ... }
        "4xl": "2000px",
        // => @media (min-width: 1600px) { ... }
        // 'mid': { 'raw': '(min-height: 650px)' },
        // => @media (min-heigt: 650px)
      },
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			}
    },
  },
  plugins: [tailwindcssAnimate],

};
