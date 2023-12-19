import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { getJob, Job, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobDetail from './JobDetail'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import { apiConnection } from 'lib/backend/api/config'
import JobList from './JobList'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSwrHelper } from 'hooks/useSwrHelper'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const config = apiConnection().qln
  const pollingIterval = 5200
  const [pollCounter, setPollCounter] = React.useState(0)
  const [selectedItem, setSelectedItem] = React.useState<Job | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [error, setError] = React.useState(false)

  const { claims, saveClaims } = useSessionPersistentStore()
  let claim = claims.find((m) => m.type === 'qln')

  const handleLogin = async (result: Claim[]) => {
    saveClaims(result)
    claim = claims.find((m) => m.type === 'qln')
    setPollCounter(-1)
    setError(false)
  }

  const apiUrl = `${config.url}/BatchJobList?Token=${claim?.token ?? ''}`

  const dataFn = async () => {
    try {
      const response = await get(apiUrl)
      if (response.status && response.status !== 200) {
        setError(true)
      }
      return response
    } catch (err) {
      throw new Error('not authenticated')
    }
  }

  const { data } = useSwrHelper<QlnApiResponse>(apiUrl, dataFn)

  const poll = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (error) {
      return
    }
    timeOutRef.current = setTimeout(() => {
      setPollCounter(pollCounter + 1)
    }, pollingIterval)
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
      <>
        {error && <AlertWithHeader severity='error' header='Error' text='authentication failed' />}
        {error && <QlnUsernameLoginForm onSuccess={handleLogin} />}

        {isLoadingDetail && <BackdropLoader />}
        {selectedItem && <JobDetail item={selectedItem} onClose={handleClose} />}
        {data && claim && <JobList response={data} onJobSelected={handleItemClicked} />}
      </>
    </Box>
  )
}

export default JobsLayout
