import LoginLayout from 'components/Organizms/Login/LoginLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { Authenticator } from '@aws-amplify/ui-react'
import { useSearchParams } from 'next/navigation'

const Page = () => {
  const searhcParams = useSearchParams()
  let returnUrl: string | undefined = undefined
  const retParam = searhcParams?.get('ret')
  if (retParam) {
    returnUrl = decodeURIComponent(retParam)
  }

  return (
    <>
      <ResponsiveContainer>
        <Authenticator.Provider>
          <LoginLayout returnUrl={returnUrl} />
        </Authenticator.Provider>
      </ResponsiveContainer>
    </>
  )
}

export default Page
