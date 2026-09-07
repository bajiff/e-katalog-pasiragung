export default {
  theme: {
    extend: {
      colors: {
        text: '#171719',
        'text-muted': '#6b6b6d',
        accent: '#1ff98c',
        border: '#171719',
        primary: '#08ba61',
        surface: '#ededed',
        background: '#ffffff',
        'on-primary': '#ffffff',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        md: '25px',
        sm: '9px',
      },
      transitionDuration: {
        fast: '300ms',
        base: '650ms',
        slow: '1200ms',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.14, 1, 0.34, 1)',
      },
      screens: {
        xs: '375px',
        sm: '768px',
        md: '1025px',
        lg: '1280px',
        xl: '1536px',
      },
    },
  },
}
