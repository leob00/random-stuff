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
import ListIterator from 'components/Organizms/sandbox/ListIterator'
import Poller from 'components/Organizms/sandbox/Poller'
import { range } from 'lodash'
import { sleep } from 'lib/util/timers'
import ListIteratorLayout from 'components/Organizms/sandbox/ListIteratorLayout'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Iterator',
      selected: true,
    },
    {
      title: 'Poller',
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
          await setProfile(newProfile)
        }
      }
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  const handleSetTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  const waitFn = async () => {
    await sleep(1500)
    return true
  }

  const handleLoginSuccess = (claims: Claim[]) => {}

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} />
        <Box p={2}>
          {selectedTab === 'Iterator' && <ListIteratorLayout />}
          {selectedTab === 'Poller' && <Poller />}
          {selectedTab === 'S3' && <>{!isLoading && authProfile ? <S3Display userProfile={authProfile} /> : <PleaseLogin />}</>}
          {selectedTab === 'Batch Post' && <PostBatch />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
