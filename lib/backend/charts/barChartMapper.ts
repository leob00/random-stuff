import { CasinoBlackTransparent, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import { RouletteNumberColor } from '../roulette/wheel'

export function translateCasinoColor(color: RouletteNumberColor) {
  switch (color) {
    case 'red':
      return CasinoRed
    case 'black':
      return CasinoBlackTransparent
    case 'zero':
    case 'doubleZero':
      return CasinoGreen
    default:
      return color
  }
}
