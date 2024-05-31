'use client'
import AppLayout from 'components/app/AppLayout'
import { ReactNode, useEffect, useState } from 'react'
import ThemeRegistry from './ThemeRegistry'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'
import { Analytics } from '@vercel/analytics/react'

const ThemeWrapper = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const { palette, savePalette } = useSessionSettings()
  // console.log('palette: ', palette)
  const handleChangeTheme = async (mode: 'light' | 'dark') => {
    //console.log('new mode: ', mode)
    savePalette(mode)
  }

  return (
    <ThemeRegistry colorMode={palette}>
      <Analytics />
      <AppLayout onChangeTheme={handleChangeTheme} colorMode={palette}>
        <>{children}</>
      </AppLayout>
    </ThemeRegistry>
  )
}

export default ThemeWrapper
