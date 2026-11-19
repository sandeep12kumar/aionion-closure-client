/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Aionion Capital brand (from the logo)
        brand: {
          blue: '#1E2BFF', // logo blue - primary
          blueDark: '#1520C9',
          navy: '#2E3192',
          midnight: '#0F1A6B',
          coral: '#FF6B7A', // logo coral - accent
          coralDark: '#E5566A',
          mist: '#EEF1FF', // light blue tint
          ink: '#0F172A',
          page: '#F4F6FD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,26,107,0.04), 0 10px 30px -8px rgba(15,26,107,0.12)',
        brand: '0 10px 24px -8px rgba(30,43,255,0.55)',
        coral: '0 8px 20px -6px rgba(255,107,122,0.55)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(0.6)', opacity: 0 }, '70%': { transform: 'scale(1.08)', opacity: 1 }, '100%': { transform: 'scale(1)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        ring: { '0%': { transform: 'scale(0.9)', opacity: 0.7 }, '100%': { transform: 'scale(1.6)', opacity: 0 } },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        pop: 'pop 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        ring: 'ring 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
