import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import PostBatch from 'components/Organizms/sandbox/PostBatch'
import { useUserController } from 'hooks/userController'
import S3Display from 'components/Organizms/files/S3Display'
import ListIteratorLayout from 'components/Organizms/sandbox/ListIteratorLayout'
import Streamer from 'components/Organizms/sandbox/Streamer'
import OcrLocal from 'components/Organizms/files/OcrLocal'
import { useState, useEffect, startTransition } from 'react'
import Playground from 'components/Organizms/admin/Playground'
import Framer from 'components/Organizms/animation/Framer'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Files',
    },
    {
      title: 'OCR',
    },
    {
      title: 'Charts',
    },
    {
      title: 'Framer',
    },
    {
      title: 'Iterator',
    },

    {
      title: 'Batch Post',
    },
  ]
  const [selectedTab, setSelectedTab] = useState(tabs[1].title)
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    startTransition(() => {
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
          {selectedTab === 'Files' && <>{!isLoading && authProfile && <S3Display />}</>}
          {selectedTab === 'OCR' && <OcrLocal />}
          {selectedTab === 'Charts' && <Playground />}
          {selectedTab === 'Framer' && <Framer />}
          {selectedTab === 'Iterator' && <ListIteratorLayout />}
          {selectedTab === 'Batch Post' && <PostBatch />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
