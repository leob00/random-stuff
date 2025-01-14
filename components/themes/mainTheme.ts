import { createTheme, PaletteOptions, responsiveFontSizes, ThemeOptions } from '@mui/material/styles'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { ResponsiveFontSizesOptions } from '@mui/material/styles/responsiveFontSizes'

export const BlackTransparent: string = '#080808ef'
export const Blue800: string = '#436ab6'
export const LightBlue = '#446ab7'
export const VeryLightBlue = '#b5d7fcdc'
export const VeryLightBlueTransparent = '#b5d7fc67'
export const VeryLightBlueOpaque = '#226db90e'
export const VeryLightBlueOpaqueLight = '#78b4f52f'
export const VeryLightTransparent = '#d6e7f821'
export const DarkBlue = '#142d5d'
export const DarkBlueTransparent = '#0b224ebb'
export const FadedWhite = 'rgba(255, 255, 255, 0.2)'
export const LightGrey = '#ecf2f1'
export const BrightGreen = '#29aa29'
export const DarkGreen = '#0d740d'
export const TransparentGreen = '#0d740dad'
export const TransparentBlue = '#446ab793'
export const CasinoGreenTransparent = '#008000bb'
export const CasinoLimeTransparent = '#44f70de7'
export const CasinoDarkGreenTransparent = '#00421abb'
export const CasinoRedTransparent = '#830707bb'
export const CasinoDarkRedTransparent = '#701524cc'
export const DarkModeRed = '#cc0d0df8'
export const CasinoPinkTransparent = '#830707b2'
export const CasinoLightPinkTransparent = '#dd4e4391'
export const CasinoRed = '#5c1717'
export const CasinoGreen = '#2d5c17'
export const CasinoBlackTransparent = '#131212bb'
export const CasinoMoreBlackTransparent = '#131212e0'
export const CasinoWhiteTransparent = '#c9c1c1de'
export const CasinoGrayTransparent = '#9e9797de'
export const CasinoLightGrayTransparent = '#ddd4d4de'
export const CasinoOrangeTransparent = '#d45309bb'
export const CasinoOrange = '#d45309'
export const CasinoBlueTransparent = '#0979d4bb'
export const CasinoBlue = '#0979d4'
export const CasinoYellowTransparent = '#fae62ebb'
export const DarkModeBlue = '#0a214c'
export const DarkModePrimary = '#90caf9'
export const DarkModeBlueTransparent = '#2f4e8dee'
export const Default = CasinoBlue
export const CasinoBlack = '#131212fa'
export const White = '#ffffff'
export const SoftWhite = '#fcfcfcf1'
export const ChartBackground = '#c2dffa3d'
export const OceanBlue = '#295d6f'
export const OceanBlueTransparent = '#0ba3d631'
export const RedDarkMode = '#f31d1d'
export const DarkModeBkg = '#010d20fa'
export const ErrorRed = '#ce250ec7'

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: DarkModeBkg,
  },
  secondary: {
    main: DarkBlue,
  },
  error: {
    main: CasinoDarkRedTransparent,
  },
  info: {
    main: CasinoBlueTransparent,
  },
  success: {
    main: CasinoGreenTransparent,
  },
}

export const typographyOptions: TypographyOptions = {
  fontFamily: ['-apple-system', 'Roboto', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"'].join(','),
  fontSize: 18,
  fontWeightBold: 'bold',

  h1: { fontSize: '3.5rem', fontWeight: 500 }, // hero section title
  h2: { fontSize: '2.6125rem', fontWeight: 500 }, // other section title
  h3: { fontSize: '2.115rem', fontWeight: 500 },
  h4: { fontSize: '1.85rem', fontWeight: 400 },
  h5: { fontSize: '1.65rem', fontWeight: 400 },
  h6: { fontSize: '1.3rem', fontWeight: 400 },
  subtitle1: { fontSize: '1.275rem', fontWeight: 200 },
  subtitle2: { fontSize: '0.975rem', fontWeight: 200 },
  body1: { fontSize: '1.25rem', fontWeight: 300 }, // normal body text
  body2: { fontSize: '1.04rem', fontWeight: 200 }, // less important text
  caption: { fontSize: '0.85rem', fontWeight: 400 },
  overline: { fontSize: '0.625rem', fontWeight: 400 },
  button: { fontSize: '1.0rem', fontWeight: 300, textTransform: 'none' },
}

const themeOptions: ThemeOptions = {
  typography: typographyOptions,

  components: {
    MuiContainer: {
      styleOverrides: {},
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: 12,
          borderRadius: '.8rem',
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: CasinoBlueTransparent,
          backgroundColor: CasinoBlue,
          fontSize: '0.875rem',
          textAlign: 'center',
          color: VeryLightBlue,
        },
        arrow: {
          color: CasinoBlue,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {},
    },
  },
}

export const rfsOptions: ResponsiveFontSizesOptions = { breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'] }
const theme = responsiveFontSizes(createTheme({ ...themeOptions, palette: lightPalette }), rfsOptions)

export default theme
