import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import NLink from 'next/link'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Page Router',
      selected: true,
    },
    {
      title: 'Login Form',
    },
    {
      title: 'Tab 3',
    },
  ]
  const [selectedTab, setSelectedTab] = React.useState(tabs[0].title)

  const handleSetTab = (tab: TabInfo) => {
    //console.log(tab)
    setSelectedTab(tab.title)
  }
  const handleLoginSuccess = (claims: Claim[]) => {
    //console.log(claims)
  }

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} />
        <Box p={2}>
          {selectedTab === 'Page Router' && (
            <Box>
              <NLink href='/status'>status</NLink>
            </Box>
          )}
          {selectedTab === 'Login Form' && (
            <Box>
              <QlnUsernameLoginForm onSuccess={handleLoginSuccess} />
            </Box>
          )}
          {selectedTab === 'Tab 3' && <Box>tab 3</Box>}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
