import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import PostBatch from 'components/Organizms/sandbox/PostBatch'
import { useUserController } from 'hooks/userController'
import S3Display from 'components/Organizms/files/S3Display'
import Poller from 'components/Organizms/sandbox/Poller'
import { sleep } from 'lib/util/timers'
import ListIteratorLayout from 'components/Organizms/sandbox/ListIteratorLayout'
import Streamer from 'components/Organizms/sandbox/Streamer'
import MultiLineChartDisplay from 'components/Organizms/sandbox/MultiLineChartDisplay'
import Ocr from 'components/Organizms/files/Ocr'
import OcrLocal from 'components/Organizms/files/OcrLocal'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Files',
      selected: true,
    },
    {
      title: 'OCR',
    },
    {
      title: 'Multi Line Chart',
    },
    {
      title: 'Stream',
    },
    {
      title: 'Iterator',
    },
    {
      title: 'Poller',
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
      const newProfile = await fetchProfilePassive()
      if (newProfile) {
        await setProfile(newProfile)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSetTab = (tab: TabInfo) => {
    React.startTransition(() => {
      setSelectedTab(tab.title)
    })
  }

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />

        <Box p={2}>
          {/* {selectedTab === 'Multi Line Chart' && <MultiLineChartDisplay />} */}
          {selectedTab === 'OCR' && <OcrLocal />}
          {selectedTab === 'Stream' && <Streamer />}
          {selectedTab === 'Iterator' && <ListIteratorLayout />}
          {selectedTab === 'Poller' && <Poller />}
          {selectedTab === 'Files' && <>{!isLoading && authProfile && <S3Display userProfile={authProfile} />}</>}
          {selectedTab === 'Batch Post' && <PostBatch />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
