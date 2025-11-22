export default {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
}
