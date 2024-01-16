import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import { Claim } from 'lib/backend/auth/userUtil'
import PostBatch from 'components/Organizms/sandbox/PostBatch'
import Playground from 'components/Organizms/admin/Playground'
import { useUserController } from 'hooks/userController'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import S3Display from 'components/Organizms/files/S3Display'

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
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const newProfile = await fetchProfilePassive()
        if (newProfile) {
          setProfile(newProfile)
        }
      }
      setIsLoading(false)
    }
    fn()
  }, [authProfile])

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
          {selectedTab === 'S3' && <>{!isLoading && authProfile ? <S3Display userProfile={authProfile} /> : <PleaseLogin />}</>}
          {selectedTab === 'Batch Post' && <PostBatch />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
