import { createTheme, PaletteOptions, responsiveFontSizes, ThemeOptions } from '@mui/material/styles'
import { ResponsiveFontSizesOptions } from '@mui/material/styles/responsiveFontSizes'

export const Blue800: string = '#436ab6'
export const LightBlue = '#446ab7'
export const FadedWhite = 'rgba(255, 255, 255, 0.2)'
export const LightGrey = '#ecf2f1'

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: LightBlue,
  },
}

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: LightGrey,
    contrastText: '#00263a',
  },
}

const themeOptions: ThemeOptions = {
  typography: {
    //fontSize: 16, fontFace: Roboto
    h1: { fontSize: '3.5rem', fontWeight: 600 }, // hero section title
    h2: { fontSize: '2.8125rem', fontWeight: 600 }, // other section title
    h3: { fontSize: '2.25rem', fontWeight: 600 },
    h4: { fontSize: '1.75rem', fontWeight: 500 },
    h5: { fontSize: '1.375rem', fontWeight: 500 },
    h6: { fontSize: '1.2rem', fontWeight: 500 },
    subtitle1: { fontSize: '1.0rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1.0rem', fontWeight: 400 }, // normal body text
    body2: { fontSize: '0.875rem', fontWeight: 400 }, // less important text
    caption: { fontSize: '0.75rem', fontWeight: 400 },
    overline: { fontSize: '0.625rem', fontWeight: 400 },
    button: { fontSize: '1.0rem', fontWeight: 'bold', textTransform: 'none' },
  },

  components: {
    MuiContainer: {
      styleOverrides: { maxWidthLg: '100%' },
    },
  },
  //components: {
  // maxWidth: 1200,

  // MuiContainer-maxWidthLg css-1oqqzyl-MuiContainer-root
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
  //},
}
const rfsOptions: ResponsiveFontSizesOptions = { breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'] }
const theme = responsiveFontSizes(createTheme({ ...themeOptions, palette: lightPalette }), rfsOptions)

export const darkTheme = responsiveFontSizes(createTheme({ ...themeOptions, palette: darkPalette }), rfsOptions)

export default theme
