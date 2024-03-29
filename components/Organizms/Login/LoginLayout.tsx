import { Authenticator } from '@aws-amplify/ui-react'
import React from 'react'
import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import { useSearchParams } from 'next/navigation'

import '@aws-amplify/ui-react/styles.css'

import awsExports from 'src/aws-exports'
import { Amplify } from 'aws-amplify'
Amplify.configure(awsExports)

export type AuthMode = 'signIn' | 'signUp' | 'resetPassword'
const LoginLayout = () => {
  const searchParams = useSearchParams()
  const ret = searchParams?.get('ret') ?? ''

  const defaultTabs: TabInfo[] = [
    {
      title: 'Sign in',
      selected: true,
    },
    {
      title: 'Create Account',
    },
  ]
  const [tabs, setTabs] = React.useState(defaultTabs)
  const [selectedTab, setSelectedTab] = React.useState(defaultTabs[0])

  const handleSetTab = async (tab: TabInfo) => {
    const newTabs = [...tabs].map((m) => {
      return { ...m, selected: false }
    })
    newTabs[newTabs.findIndex((m) => m.title === tab.title)].selected = true
    setTabs(newTabs)
    setSelectedTab(tab)
  }

  return (
    <>
      <CenterStack sx={{ py: 4 }}>
        <Typography variant='body1'>Please sign in to use advanced features such as keeping notes, saving tasks, and managing stocks.</Typography>
      </CenterStack>
      <Box sx={{ paddingLeft: { lg: 40 } }}>
        <TabList tabs={tabs} onSetTab={handleSetTab} />
      </Box>
      <Box sx={{ minHeight: 500 }}>
        <>
          {selectedTab.title === 'Sign in' && <Authenticator variation='default' initialState={'signIn'} />}
          {selectedTab.title === 'Create Account' && <Authenticator variation='default' initialState={'signUp'} />}
        </>
      </Box>
    </>
  )
}
export default LoginLayout
