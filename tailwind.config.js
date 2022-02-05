module.exports = {
  mode: 'jit',
  theme: {
    screens:{
      'xs': '440px',
      'sm':'550px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1350px',
      'xxl': '1536px'
    },
    colors:{
      'red': '#9b3d25',
      'light-yellow': '#fee68b',
      'yellow': '#fac648',
      'orange': '#cc6600',
      'pink': '#ff996c',
      'light-green': '#c6e9b8',
      'green': '#2d7c6e',
      'grey': '#eae4e4',
      'blue': '#174d8c',
      'black': '#2a201e',
      'white': '#FFFFFF'
    },
    fontFamily:{
      sans: ['Montserrat', 'sans-serif'],
      serif: ['Rufina', 'serif'],
    },
    extend:{
      padding:{
        'full':'100%',
        'half': '50%',
        '18': '4.5rem',
        '30': '7.5rem',
        '38': '9.5rem'
      },
      margin:{
        '18': '4.5rem'
      },
      fill: theme => ({
         'red': theme('colors.red'),
         'black': theme('colors.black'),
         'white': '#FFFFFF'
       }),
       stroke: theme => ({
          'red': theme('colors.red'),
          'black': theme('colors.black'),
          'yellow': theme('colors.yellow'),
          'white': '#FFFFFF'
        })
    }
  }
}
