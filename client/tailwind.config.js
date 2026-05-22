/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--color-bg-base)',
        'bg-dark': '#1C1917',
        'bg-darkest': '#0D0D0C',
        copper: '#D97757',
        'copper-light': '#E8A87C',
        'copper-dark': '#B85C3A',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        surface: 'var(--color-surface)',
        'surface-warm': 'var(--color-surface-warm)',
        'border-warm': 'var(--color-border-warm)',
        success: '#4CAF79',
        error: '#E53E3E',
        warning: '#DD6B20',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
