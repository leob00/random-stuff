import dayjs from 'dayjs'

export const isBrowser = () => typeof window !== 'undefined'

export interface WindowDimension {
  width: number
  height: number
}

export const getWindowDimensions = () => {
  const isClient = typeof window
  const hasWindow = typeof window !== 'undefined'
  let dimension: WindowDimension = {
    width: 320,
    height: 320,
  }
  if (hasWindow) {
    const { innerWidth: width, innerHeight: height } = window
    dimension.width = window.screen.width
    dimension.height = window.screen.height
  }
  return dimension
}

export const logger = (text: string) => {
  console.log(`${dayjs(new Date()).format('MM/DD/YYYY hh:mm a')} - ${text}`)
}
