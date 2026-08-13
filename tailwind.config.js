export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: '#0E0C0D',
        surface: {
          DEFAULT: '#171314',
          raised: '#20191B',
          high: '#2A2225',
        },
        line: {
          DEFAULT: '#332A2D',
          soft: '#241E20',
        },
        cream: '#F6F0E8',
        mist: '#B4A7A2',
        dust: '#8A7D79',
        wine: {
          DEFAULT: '#9B1B3B',
          deep: '#6E1128',
          bright: '#C42B53',
        },
        gold: {
          DEFAULT: '#C9A24A',
          deep: '#7E6428',
        },
        paper: '#F4EDE1',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        read: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
      },
      maxWidth: {
        read: '38rem',
      },
      transitionTimingFunction: {
        kisa: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}
