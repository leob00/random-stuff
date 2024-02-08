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
import MultiLineChart from 'components/Atoms/Charts/MultiLineChart'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { useSwrHelper } from 'hooks/useSwrHelper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { getEconDataReportDowJones, getEconDataReportSnp } from 'lib/backend/api/qln/qlnApi'
import dayjs from 'dayjs'
import { CasinoBlue } from 'components/themes/mainTheme'
import MultiLineChartDisplay from 'components/Organizms/sandbox/MultiLineChartDisplay'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Multi Line Chart',
      selected: true,
    },
    {
      title: 'Files',
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

  const waitFn = async () => {
    await sleep(1500)
    return true
  }

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} />

        <Box p={2}>
          {selectedTab === 'Multi Line Chart' && <MultiLineChartDisplay />}
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
