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
import { auth } from 'aws-crt'
import Streamer from 'components/Organizms/sandbox/Streamer'
import UploadLargeFile from 'components/Organizms/sandbox/UploadLargeFile'
import MultiLineChart from 'components/Atoms/Charts/MultiLineChart'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { getStockOrFutureChart } from 'lib/backend/api/qln/chartApi'
import { mapHistory } from 'components/Organizms/stocks/StockChart'

const Page = () => {
  const tabs: TabInfo[] = [
    {
      title: 'Multi Line Chart',
      selected: true,
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
      title: 'S3',
    },
    {
      title: 'Batch Post',
    },
  ]
  const [selectedTab, setSelectedTab] = React.useState(tabs[0].title)
  const { authProfile, fetchProfilePassive, setProfile } = useUserController()
  const [isLoading, setIsLoading] = React.useState(true)

  const chartFn = async () => {
    const xyVaues: XyValues[] = []
    const stock = await getStockOrFutureChart('NVDA', 90, true)
    const stockChart = mapHistory(stock)
    xyVaues.push(stockChart)
    return xyVaues
  }

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
    setSelectedTab(tab.title)
  }

  const waitFn = async () => {
    await sleep(1500)
    return true
  }

  const xYValues: XyValues[] = [
    {
      name: 'First',
      x: ['Jan', 'Feb', 'March'],
      y: [3, 4, 6.5],
    },
    {
      name: 'Second',
      x: ['Jan', 'Feb', 'March'],
      y: [6.5, 4.8, 3.2],
    },
  ]

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} />
        <Box p={2}>
          {selectedTab === 'Multi Line Chart' && <MultiLineChart xYValues={xYValues} />}
          {selectedTab === 'Stream' && <Streamer />}
          {selectedTab === 'Iterator' && <ListIteratorLayout />}
          {selectedTab === 'Poller' && <Poller />}
          {selectedTab === 'S3' && <>{!isLoading && authProfile && <S3Display userProfile={authProfile} />}</>}
          {selectedTab === 'Batch Post' && <PostBatch />}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
