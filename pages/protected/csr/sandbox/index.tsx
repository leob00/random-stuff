import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'
import FileUploadForm from 'components/Molecules/Forms/FileUploadForm'
import PostBatch from 'components/Organizms/sandbox/PostBatch'
import S3FilesLayout from 'components/Organizms/files/S3FilesLayout'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Batch Post',
      selected: true,
    },
    {
      title: 'Login Form',
    },
    {
      title: 'S3',
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
          {selectedTab === 'Batch Post' && <PostBatch />}
          {selectedTab === 'Login Form' && (
            <Box>
              <QlnUsernameLoginForm onSuccess={handleLoginSuccess} />
            </Box>
          )}
          {selectedTab === 'S3' && <S3FilesLayout />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
