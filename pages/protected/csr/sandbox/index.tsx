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

  const chartFn = async () => {
    const xyVaues: XyValues[] = []
    const startYear = dayjs().add(-5, 'years').year()
    const endYear = dayjs().year()
    const snp = await getEconDataReportSnp(startYear, endYear)
    const snpChart: XyValues = {
      name: 'S&P 500',
      color: CasinoBlue,
      x: snp.Chart!.XValues,
      y: snp.Chart!.YValues.map((m) => Number(m)),
    }
    const dj = await getEconDataReportDowJones(startYear, endYear)
    const djChart: XyValues = {
      name: 'Dow Jones Industrial Average',
      x: dj.Chart!.XValues,
      y: dj.Chart!.YValues.map((m) => Number(m)),
    }
    xyVaues.push(djChart)

    xyVaues.push(snpChart)
    // console.log('djChart: ', djChart)
    // console.log('snpChart: ', snpChart)

    return xyVaues
  }
  const { data, isLoading: isFetching } = useSwrHelper(`api/baseRoute?id=multiChart,NVDA,META`, chartFn, { revalidateOnFocus: false })

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
        {isFetching && <BackdropLoader />}
        <Box p={2}>
          {selectedTab === 'Multi Line Chart' && <>{data && <MultiLineChart xYValues={data} yLabelPrefix={'$'} />}</>}
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
