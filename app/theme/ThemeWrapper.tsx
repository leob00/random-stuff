'use client'
import AppLayout from 'components/app/AppLayout'
import { ReactNode, useEffect, useState } from 'react'
import ThemeRegistry, { getTheme } from './ThemeRegistry'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'

const ThemeWrapper = ({ children }: { children: ReactNode | React.JSX.Element[] }) => {
  const { palette, savePalette } = useSessionSettings()

  const [theme, setTheme] = useState(getTheme(palette))

  // console.log('palette: ', palette)
  const handleChangeTheme = async (mode: 'light' | 'dark') => {
    //console.log('new mode: ', mode)
    savePalette(mode)
    setTheme(getTheme(mode))
  }

  return (
    <>
      <AppLayout onChangeTheme={handleChangeTheme} theme={theme}>
        <>{children}</>
      </AppLayout>
    </>
  )
}

export default ThemeWrapper
