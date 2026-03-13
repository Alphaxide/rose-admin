import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Beauty brand colors - solid, premium aesthetic for Nairobi market
        primary: {
          50: '#faf8f7',
          100: '#f5f1ee',
          200: '#e8ddd6',
          300: '#dcc7be',
          400: '#c9a88a', // Main beauty gold
          500: '#b8906a',
          600: '#a37a56',
          700: '#8e6647',
          800: '#7a5438',
          900: '#66432a',
        },
        secondary: {
          50: '#fdf9f7',
          100: '#faf4f0',
          200: '#f5e8e0',
          300: '#eed8ce',
          400: '#e5c2b2', // Soft rose
          500: '#d9a895',
          600: '#c88e78',
          700: '#af6f5e',
          800: '#965547',
          900: '#7d3b31',
        },
        accent: {
          50: '#f0f7f4',
          100: '#d4ebe4',
          200: '#b8dfd4',
          300: '#7cb8a3', // Jade green
          400: '#5ca684',
          500: '#4a9470',
          600: '#3d7c5a',
          700: '#306447',
          800: '#244c35',
          900: '#1a3423',
        },
        neutral: {
          0: '#ffffff',
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a29d9a',
          500: '#78716b',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
