import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import { useUserController } from 'hooks/userController'
import S3Display from 'components/Organizms/files/S3Display'
import ListIteratorLayout from 'components/Organizms/sandbox/ListIteratorLayout'
import OcrLocal from 'components/Organizms/files/OcrLocal'
import { useState, useEffect, startTransition } from 'react'
import Playground from 'components/Organizms/admin/Playground'
import Framer from 'components/Organizms/sandbox/Framer'
import ApiStream from 'components/Organizms/admin/stream/ApiStream'
import DragAndDrop from 'components/Organizms/sandbox/DragAndDrop'

const Page = () => {
  const tabs: TabInfo[] = [
    { title: 'Api Stream' },
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
      title: 'Drag & Drop',
    },
  ]
  const [selectedTab, setSelectedTab] = useState(tabs[0].title)
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const newProfile = await fetchProfilePassive()
        await setProfile(newProfile)
      }
      setIsLoading(false)
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
          {selectedTab === 'Api Stream' && <ApiStream />}
          {selectedTab === 'Files' && <>{!isLoading && authProfile && <S3Display />}</>}
          {selectedTab === 'OCR' && <OcrLocal />}
          {selectedTab === 'Charts' && <Playground />}
          {selectedTab === 'Framer' && <Framer />}
          {selectedTab === 'Iterator' && <ListIteratorLayout />}
          {selectedTab === 'Drag & Drop' && <DragAndDrop />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
