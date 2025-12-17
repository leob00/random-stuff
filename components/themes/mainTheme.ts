import { createTheme, PaletteOptions, responsiveFontSizes, ThemeOptions, TypographyVariantsOptions } from '@mui/material/styles'
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
export const CasinoGreenTransparent = '#027902bb'
export const CasinoGreenTransparentChart = '#027902a9'
export const CasinoLimeTransparent = '#44f70de7'
export const CasinoDarkGreenTransparent = '#018a38af'
export const CasinoRedTransparent = '#830707bb'
export const CasinoRedTransparentChart = '#8a0808a9'
export const CasinoRedTransparentChartLight = '#831414f8'
export const CasinoDarkRedTransparent = '#970019f1'
export const DarkModeRed = '#cc0d0df8'
export const CasinoPinkTransparent = '#9b13139d'
export const CasinoLightPinkTransparent = '#dd4e4391'
export const CasinoRed = '#5c1717'
export const CasinoGreen = '#276409f6'
export const CasinoBlackTransparent = '#131212bb'
export const CasinoMoreBlackTransparent = '#131212e0'

export const CasinoWhiteTransparent = '#c9c1c1ef'
export const CasinoGrayTransparent = '#363131c2'
export const CasinoLightGrayTransparent = '#f7f2f296'
export const CasinoOrangeTransparent = '#d45309bb'
export const CasinoOrangeTransparentOpaque = '#d453098f'
export const CasinoOrange = '#d45309'
export const CasinoBlueTransparent = '#0979d4bb'
export const CasinoBlue = '#0979d4'
export const CasinoYellowTransparent = '#e9d201d3'
export const DarkModeBlue = '#0a214c'
export const DarkModePrimary = '#90caf9'
export const DarkModeBlueTransparent = '#2f4e8dee'
export const Default = CasinoBlue
export const CasinoBlack = '#131212fa'
export const CasinoBlackDarkMode = '#2c2929fa'
export const White = '#ffffff'
export const SoftWhite = '#fcfcfcf1'
export const ChartBackground = '#c2dffa3d'
export const OceanBlue = '#295d6f'
export const OceanBlueTransparent = '#0ba3d631'
export const RedDarkMode = '#f31d1d'
export const DarkModeBkg = '#010d20fa'
export const TooltipBkg = '#000713ee'
export const GoldColor = '#B8860B'

export const ErrorRed = '#ce250ec7'

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: DarkBlue,
    contrastText: SoftWhite,
  },
  secondary: {
    main: CasinoBlue,
  },
  error: {
    main: CasinoDarkRedTransparent,
  },
  info: {
    main: CasinoBlue,
  },
  success: {
    main: CasinoGreenTransparent,
  },
  warning: {
    main: CasinoOrange,
    //contrastText: 'yellow',
  },
}

export const typographyOptions: TypographyVariantsOptions = {
  //fontFamily: ['-apple-system', 'Roboto', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"'].join(','),
  fontFamily: ['-apple-system', 'Roboto', 'Tahoma', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"'].join(','),
  fontSize: 18,
  fontWeightBold: 'bold',

  h1: { fontSize: '3.5rem', fontWeight: 500 }, // hero section title
  h2: { fontSize: '2.6125rem', fontWeight: 500 }, // other section title
  h3: { fontSize: '2.115rem' },
  h4: { fontSize: '1.8rem' },
  h5: { fontSize: '1.5rem' },
  h6: { fontSize: '1.3rem' },
  subtitle1: { fontSize: '1.275rem', fontWeight: 200 },
  subtitle2: { fontSize: '0.975rem', fontWeight: 200 },
  body1: { fontSize: '1.2rem', fontWeight: 400 }, // normal body text
  body2: { fontSize: '1.09rem', fontWeight: 400 }, // less important text
  caption: { fontSize: '0.85rem' },
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
          backgroundColor: DarkModeBkg,
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
