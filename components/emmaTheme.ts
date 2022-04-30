import { createTheme } from '@mui/material/styles'
import { common } from '@mui/material/colors'
import { blue, blueGrey, green } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: 'rgb(0,131,218)',
      main: 'rgb(0,131,218)',
      dark: blueGrey[900],
    },
    //     main: common.white,
    // },
    // secondary: {
    //     main:"#003668",
    // },
    //secondary: blue
  },

  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
      // fontFamily: 'sans-serif'
    },
  },

  components: {
    // MuiButtonBase: {
    //   defaultProps: {
    //     disableRipple: false
    //   },
    // },
    // MuiButton: {
    //   variants: [
    //     {
    //       props: { variant: 'outlined' },
    //       style: {
    //         textTransform: 'none',
    //         //border: `2px dashed #2196F3`,
    //       },
    //     },
    //     {
    //       props: { variant: 'outlined', color: 'secondary' },
    //       style: {
    //         //border: `4px dashed red`,
    //       },
    //     },
    //   ],
    // },
  },
})
export default theme
function rgb(arg0: number, arg1: number, arg2: number) {
  throw new Error('Function not implemented.')
}
