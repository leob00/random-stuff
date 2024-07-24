import { Authenticator } from '@aws-amplify/ui-react'
import React, { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import '@aws-amplify/ui-react/styles.css'
import { useAuthenticator } from '@aws-amplify/ui-react'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useRouter } from 'next/navigation'
import { useRouteTracker } from '../session/useRouteTracker'
export type AuthMode = 'signIn' | 'signUp' | 'resetPassword'

const LoginLayout = () => {
  const router = useRouter()

  const { authStatus, signOut, toSignIn, toSignUp, toForgotPassword, isPending } = useAuthenticator((context) => [context.authStatus])
  const { lastRoute } = useRouteTracker()

  const defaultTabs: TabInfo[] = [
    {
      title: 'Sign in',
    },
    {
      title: 'Create Account',
    },
  ]

  const [selectedTab, setSelectedTab] = React.useState(defaultTabs[0])

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
    if (authStatus === 'authenticated') {
      router.push(lastRoute)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus])

  return (
    <>
      {authStatus === 'configuring' || (isPending && <BackdropLoader />)}
      {authStatus === 'unauthenticated' && (
        <>
          <CenterStack sx={{ py: 4 }}>
            <Typography variant='body1'>Please sign in to use advanced features such as keeping notes, saving tasks, and managing stocks.</Typography>
          </CenterStack>
          <Box sx={{ paddingLeft: { lg: 40 } }}>
            <TabList tabs={defaultTabs} onSetTab={handleSetTab} selectedTab={defaultTabs.findIndex((m) => m.title === selectedTab.title)} />
          </Box>
          <Authenticator key={'signIn'} variation='default' />
        </>
      )}
    </>
  )
}

export default LoginLayout
