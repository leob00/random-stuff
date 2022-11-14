import { blue, deepOrange } from '@mui/material/colors'
import { createTheme, PaletteOptions, responsiveFontSizes, ThemeOptions } from '@mui/material/styles'
import { ResponsiveFontSizesOptions } from '@mui/material/styles/responsiveFontSizes'

export const Blue800: string = '#436ab6'
export const LightBlue = '#446ab7'
export const VeryLightBlue = '#d6e7f8'
export const VeryLightBlueTransparent = '#d6e7f8bb'
export const DarkBlue = '#0b224e'
export const DarkBlueTransparent = '#0b224ebb'
export const FadedWhite = 'rgba(255, 255, 255, 0.2)'
export const LightGrey = '#ecf2f1'
export const BrightGreen = '#29aa29'
export const DarkGreen = '#0d740d'
export const TransparentGreen = '#0d740dad'
export const TransparentBlue = '#446ab793'
export const CasinoGreenTransparent = '#123104bb'
export const CasinoRedTransparent = '#830707bb'
export const CasinoPinkTransparent = '#830707b2'
export const CasinoRed = '#830707'
export const CasinoGreen = '#2d5c17'
export const CasinoBlackTransparent = '#131212bb'
export const CasinoMoreBlackTransparent = '#131212e0'
export const CasinoWhiteTransparent = '#c9c1c1de'
export const CasinoGrayTransparent = '#9e9797de'
export const CasinoLightGrayTransparent = '#ddd4d4de'
export const CasinoOrangeTransparent = '#d45309bb'
export const CasinoBlueTransparent = '#0979d4bb'
export const CasinoBlue = '#0979d4'
export const CasinoYellowTransparent = '#fae62ebb'
export const DarkModeBlue = '#2f4e8d'
export const DarkModeBlueTransparent = '#2f4e8dee'
export const Default = '#4b77cf'

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: DarkModeBlue,
  },
  secondary: {
    main: CasinoBlue,
  },
  error: {
    main: CasinoPinkTransparent,
  },
  info: {
    main: CasinoLightGrayTransparent,
  },
  success: {
    main: CasinoGreen,
  },
}

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: VeryLightBlue,
    contrastText: VeryLightBlue,
  },
  background: {
    default: DarkModeBlue,
    paper: DarkModeBlue,
  },
  text: {
    primary: VeryLightBlue,
    secondary: VeryLightBlue,
  },
}

const themeOptions: ThemeOptions = {
  typography: {
    //fontSize: 16, fontFace: Roboto,
    /* fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','), */
    h1: { fontSize: '3.5rem', fontWeight: 600 }, // hero section title
    h2: { fontSize: '2.8125rem', fontWeight: 600 }, // other section title
    h3: { fontSize: '2.25rem', fontWeight: 600 },
    h4: { fontSize: '1.75rem', fontWeight: 500 },
    h5: { fontSize: '1.375rem', fontWeight: 500 },
    h6: { fontSize: '1.2rem', fontWeight: 500 },
    subtitle1: { fontSize: '1.0rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1.0rem', fontWeight: 400, color: Default }, // normal body text
    body2: { fontSize: '0.875rem', fontWeight: 400 }, // less important text
    caption: { fontSize: '0.75rem', fontWeight: 400 },
    overline: { fontSize: '0.625rem', fontWeight: 400 },
    button: { fontSize: '1.0rem', fontWeight: 'bold', textTransform: 'none' },
  },

  components: {
    MuiContainer: {
      styleOverrides: { maxWidthLg: '100%' },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: '.4em',
          backgroundColor: CasinoBlueTransparent,
          fontSize: '1.2rem',
        },
        arrow: {
          color: CasinoBlueTransparent,
        },
      },
    },
  },
}
const rfsOptions: ResponsiveFontSizesOptions = { breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'] }
const theme = responsiveFontSizes(createTheme({ ...themeOptions, palette: lightPalette }), rfsOptions)

export const darkTheme = responsiveFontSizes(createTheme({ ...themeOptions, palette: darkPalette }), rfsOptions)

export default theme
