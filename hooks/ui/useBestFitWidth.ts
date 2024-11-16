import { useMediaQuery, useTheme } from '@mui/material'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import { WidgetDimensions } from 'components/Organizms/widgets/RenderWidget'

export const useBestFitWidth = (size: WidgetSize) => {
  const theme = useTheme()
  const isXsmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmall = useMediaQuery(theme.breakpoints.only('sm'))
  const isMedium = useMediaQuery(theme.breakpoints.only('md'))
  const isLarge = useMediaQuery(theme.breakpoints.only('lg'))
  const isXlarge = useMediaQuery(theme.breakpoints.only('xl'))
  const dimension: WidgetDimensions = {
    height: 400,
    width: 340,
  }
  // if (!isXsmall) {
  //   if (isMedium) {
  //     dimension.width = 450
  //   }
  //   if (isLarge) {
  //     dimension.width = 1200
  //   }
  //   if (isXlarge) {
  //     dimension.width = 600
  //   }
  // }

  switch (size) {
    case 'sm':
      if (!isXsmall) {
        if (isSmall) {
          dimension.width = 340
        }
        if (isMedium) {
          dimension.width = 225
        }
        if (isLarge) {
          dimension.width = 600
        }
        if (isXlarge) {
          dimension.width = 800
        }
      }
    case 'md':
      if (!isXsmall) {
        if (isSmall) {
          dimension.width = 500
        }
        if (isMedium) {
          dimension.width = 600
        }
        if (isLarge) {
          dimension.width = 800
        }
        if (isXlarge) {
          dimension.width = 900
        }
      }
      break
    case 'lg':
      dimension.height = 900
      dimension.width = 1138
      break
  }

  return {
    dimension,
  }
}
