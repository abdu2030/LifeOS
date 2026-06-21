import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lifeos: {
          bg: '#050a0f',
          panel: '#101929',
          blue: '#3777ff',
          purple: '#7c3cff',
          green: '#21d07a',
          amber: '#f8a831',
          red: '#ff4d6d',
        },
      },
      borderRadius: {
        lifeos: '14px',
      },
      boxShadow: {
        lifeos: '0 22px 70px rgba(0, 0, 0, 0.36)',
      },
    },
  },
} satisfies Config
