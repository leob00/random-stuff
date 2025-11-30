import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Seo from 'components/Organizms/Seo'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import StyledRoot from 'components/themes/StyledRoot'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Seo pageTitle='Random Stuff' />
      <StyledRoot>
        <Component {...pageProps} />
      </StyledRoot>
    </>
  )
}

export default MyApp
