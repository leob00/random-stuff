import { Authenticator } from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { Alert, Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import '@aws-amplify/ui-react/styles.css'
import { useAuthenticator } from '@aws-amplify/ui-react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useRouter } from 'next/router'
import { AuthUser } from 'aws-amplify/auth'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
export type AuthMode = 'signIn' | 'signUp' | 'resetPassword'

const LoginLayout = ({ defaultTab = 'Sign in', returnUrl }: { defaultTab?: 'Sign in' | 'Create Account'; returnUrl?: string }) => {
  const router = useRouter()

  const { authStatus, toSignIn, toSignUp, isPending, user } = useAuthenticator((context) => [context.authStatus])
  const [initialUserState, setInitialUserState] = useState<AuthUser | undefined>(user)

  const defaultTabs: TabInfo[] = [
    {
      title: 'Sign in',
    },
    {
      title: 'Create Account',
    },
  ]

  const [selectedTab, setSelectedTab] = useState(defaultTabs.find((m) => m.title === defaultTab))

  const handleSetTab = async (tab: TabInfo) => {
    switch (tab.title) {
      case 'Sign in':
        toSignIn()
        break
      case 'Create Account':
        toSignUp()
        break
    }
    setSelectedTab(tab)
  }

  useEffect(() => {
    if (user) {
      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push('/')
      }
      return
    }
    if (!initialUserState && !!user && authStatus === 'authenticated') {
      setInitialUserState(user)
      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push('/')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authStatus])

  return (
    <>
      {authStatus === 'configuring' || (isPending && <BackdropLoader />)}
      {authStatus === 'unauthenticated' && (
        <>
          <CenterStack sx={{ py: 4 }}>
            <Typography variant='body1'>Please sign in to use advanced features such as keeping notes, saving tasks, and managing stocks.</Typography>
          </CenterStack>
          <Box sx={{ paddingLeft: { lg: 40 } }}>
            <TabList tabs={defaultTabs} onSetTab={handleSetTab} selectedTab={defaultTabs.findIndex((m) => m.title === selectedTab?.title)} />
          </Box>
          <Authenticator variation='default' initialState={defaultTab === 'Sign in' ? 'signIn' : 'signUp'}></Authenticator>
        </>
      )}
      {authStatus === 'authenticated' && (
        <>
          <CenterStack sx={{ py: 8 }}>
            <FadeIn>
              <AlertWithHeader severity='success' header='welcome!' text='' />
            </FadeIn>
          </CenterStack>
        </>
      )}
    </>
  )
}

export default LoginLayout
