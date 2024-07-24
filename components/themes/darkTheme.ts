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
  typographyOptions,
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
  typography: typographyOptions,
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
