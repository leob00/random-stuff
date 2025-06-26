import { useTheme } from '@mui/material'
import {
  CasinoBlue,
  CasinoDarkGreenTransparent,
  CasinoGreen,
  CasinoRed,
  CasinoYellowTransparent,
  DarkBlue,
  DarkGreen,
  DarkModeRed,
  VeryLightBlue,
} from 'components/themes/mainTheme'

export type ChatbotRole = 'user' | 'assistant' | 'error'

export const useChatbotColors = () => {
  const theme = useTheme()

  const getColor = (userRole: ChatbotRole) => {
    let color = CasinoBlue
    const mode = theme.palette.mode

    switch (userRole) {
      case 'user':
        color = CasinoBlue
        break
      case 'assistant':
        color = mode === 'light' ? CasinoGreen : VeryLightBlue
        break
      case 'error':
        color = mode === 'light' ? DarkModeRed : CasinoRed
        break
    }

    return color
  }
  return {
    getColor,
  }
}
