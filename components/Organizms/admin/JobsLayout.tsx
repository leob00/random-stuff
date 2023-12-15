import { Box, Paper, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { getJob, Job, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobInProgress from './JobInProgress'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import JobDetail from './JobDetail'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import useSWR, { Fetcher, mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import { CasinoBlue } from 'components/themes/mainTheme'
import { apiConnection } from 'lib/backend/api/config'
import JobList from './JobList'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const config = apiConnection().qln
  const [pollCounter, setPollCounter] = React.useState(0)
  const [selectedItem, setSelectedItem] = React.useState<Job | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const { claims } = useSessionPersistentStore()
  let claim = claims.find((m) => m.type === 'qln')

  const apiUrl = `${config.url}/BatchJobList?Token=${claim!.token}`
  const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)
  const { data, isLoading } = useSWR(apiUrl, fetcher)

  const poll = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      setPollCounter(pollCounter + 1)
    }, 5000)
  }

  const handleItemClicked = async (item: Job) => {
    setIsLoadingDetail(true)
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const result = await getJob(claim?.token!, item.Name)
    setSelectedItem(result)
    setIsLoadingDetail(false)
  }
  const handleClose = () => {
    setSelectedItem(null)
    poll()
  }

  React.useEffect(() => {
    poll()
    mutate(apiUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollCounter])

  return (
    <Box>
      {isLoading ? (
        <BackdropLoader />
      ) : (
        <>
          {isLoadingDetail && <BackdropLoader />}
          {selectedItem && <JobDetail item={selectedItem} onClose={handleClose} />}
          {data && <JobList response={data} onJobSelected={handleItemClicked} />}
        </>
      )}
    </Box>
  )
}

export default JobsLayout
