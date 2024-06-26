import { createTheme, PaletteOptions, responsiveFontSizes, ThemeOptions } from '@mui/material'
import {
  VeryLightBlue,
  DarkModeBlue,
  CasinoBlueTransparent,
  CasinoBlue,
  rfsOptions,
  CasinoGreenTransparent,
  CasinoBlackTransparent,
  DarkModePrimary,
  CasinoDarkRedTransparent,
  CasinoOrange,
  CasinoOrangeTransparent,
  DarkModeBkg,
  DarkModeRed,
} from './mainTheme'

const darkPalette: PaletteOptions = {
  mode: 'dark',

  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: VeryLightBlue,
    contrastText: CasinoBlackTransparent,
  },
  error: {
    main: CasinoDarkRedTransparent,
    contrastText: VeryLightBlue,
  },
  info: {
    main: CasinoBlueTransparent,
    contrastText: VeryLightBlue,
  },
  success: {
    main: CasinoGreenTransparent,
    contrastText: VeryLightBlue,
  },
  warning: {
    main: CasinoOrange,
    contrastText: CasinoOrangeTransparent,
  },

  background: {
    default: DarkModeBkg,
    paper: DarkModeBkg,
  },
  text: {
    primary: VeryLightBlue,
    //   secondary: VeryLightBlue,
  },
}

const darkThemeOptions: ThemeOptions = {
  palette: darkPalette,

  typography: {
    // fontSize: 16, fontFace: Roboto,
    fontFamily: ['-apple-system', 'Roboto', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"'].join(','),
    fontSize: 18,
    fontWeightBold: 'bold',
    allVariants: {
      color: DarkModePrimary,
    },

    h1: { fontSize: '3.5rem', fontWeight: 500 }, // hero section title
    h2: { fontSize: '2.6125rem', fontWeight: 500 }, // other section title
    h3: { fontSize: '2.115rem', fontWeight: 500 },
    h4: { fontSize: '1.95rem', fontWeight: 300 },
    h5: { fontSize: '1.45rem', fontWeight: 200 },
    h6: { fontSize: '1.2rem', fontWeight: 200 },
    subtitle1: { fontSize: '1.275rem', fontWeight: 300 },
    subtitle2: { fontSize: '0.975rem', fontWeight: 200 },
    body1: { fontSize: '1.175rem', fontWeight: 300 }, // normal body text
    body2: { fontSize: '1.08rem', fontWeight: 200 }, // less important text
    caption: { fontSize: '0.85rem', fontWeight: 400 },
    overline: { fontSize: '0.625rem', fontWeight: 400 },
    button: { fontSize: '1.0rem', fontWeight: 300, textTransform: 'none' },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: '100%',
        // root: {
        //   backgroundColor: DarkModeBlue,
        // },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          padding: 12,
          borderRadius: '.8rem',
          borderStyle: 'solid',
          borderWidth: 0,
          borderColor: VeryLightBlue,
          backgroundColor: CasinoBlue,
          fontSize: '1.0rem',
          textAlign: 'center',
          color: VeryLightBlue,
        },
        arrow: {
          color: CasinoBlue,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          //backgroundColor: DarkModeBlue,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: DarkModePrimary,
        },
      },
    },
    // MuiTabs: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: DarkModeBlue,
    //     },
    //     indicator: {
    //       backgroundColor: VeryLightBlue,
    //     },
    //   },
    // },
  },
}
const darkTheme = responsiveFontSizes(createTheme({ ...darkThemeOptions, palette: darkPalette }), rfsOptions)
export default darkTheme
