'use client'
import AppLayout from 'components/app/AppLayout'
import { ReactNode, useEffect, useState } from 'react'
import ThemeRegistry from './ThemeRegistry'
import { useSessionSettings } from 'components/Organizms/session/useSessionSettings'

const ThemeWrapper = ({ children }: { children: ReactNode | JSX.Element[] }) => {
  const { palette, savePalette } = useSessionSettings()
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(palette)
  const handleChangeTheme = async (mode: 'light' | 'dark') => {
    console.log('new mode: ', mode)
    setColorMode(mode)
    savePalette(mode)
  }

  useEffect(() => {
    if (palette !== colorMode) {
      savePalette(colorMode)
      setColorMode(palette)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette])

  return (
    <ThemeRegistry colorMode={colorMode}>
      <body>
        <div>
          <AppLayout onChangeTheme={handleChangeTheme} colorMode={colorMode}>
            <>{children}</>
          </AppLayout>
        </div>
      </body>
    </ThemeRegistry>
  )
}

export default ThemeWrapper
