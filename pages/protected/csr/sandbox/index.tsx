import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import PostBatch from 'components/Organizms/sandbox/PostBatch'
import S3FilesLayout from 'components/Organizms/files/S3FilesLayout'
import Playground from 'components/Organizms/admin/Playground'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'New',
      selected: true,
    },
    {
      title: 'S3',
    },
    {
      title: 'Batch Post',
    },
  ]
  const [selectedTab, setSelectedTab] = React.useState(tabs[0].title)

  const handleSetTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }
  const handleLoginSuccess = (claims: Claim[]) => {}

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} />
        <Box p={2}>
          {selectedTab === 'New' && <Playground />}
          {selectedTab === 'S3' && <S3FilesLayout />}
          {selectedTab === 'Batch Post' && <PostBatch />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
