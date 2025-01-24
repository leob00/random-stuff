import { createTheme, PaletteOptions, responsiveFontSizes, ThemeOptions } from '@mui/material'
import {
  VeryLightBlue,
  CasinoBlueTransparent,
  CasinoBlue,
  rfsOptions,
  CasinoGreenTransparent,
  DarkModePrimary,
  CasinoOrange,
  CasinoOrangeTransparent,
  DarkModeBkg,
  typographyOptions,
  ErrorRed,
  CasinoBlack,
} from './mainTheme'

const darkPalette: PaletteOptions = {
  mode: 'dark',

  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: VeryLightBlue,
    contrastText: CasinoBlack,
  },
  error: {
    main: ErrorRed,
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
    main: CasinoOrangeTransparent,
    contrastText: VeryLightBlue,
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
