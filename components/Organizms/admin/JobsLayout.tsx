import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { getJob, Job, QlnApiResponse, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobDetail from './JobDetail'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { mutate } from 'swr'
import { get } from 'lib/backend/api/fetchFunctions'
import { apiConnection } from 'lib/backend/api/config'
import JobList from './JobList'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSwrHelper } from 'hooks/useSwrHelper'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { usePolling } from 'hooks/usePolling'
import { useEffect, useState } from 'react'
dayjs.extend(relativeTime)

const JobsLayout = () => {
  const config = apiConnection().qln
  const pollingIterval = 8000
  const [selectedItem, setSelectedItem] = useState<Job | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [error, setError] = useState(false)

  const { claims, saveClaims } = useSessionStore()
  let claim = claims.find((m) => m.type === 'qln')

  const { start, stop, pollCounter: counter } = usePolling(pollingIterval, 100)

  const handleLogin = async (result: Claim[]) => {
    saveClaims(result)
    claim = claims.find((m) => m.type === 'qln')
    setError(false)
    start()
  }

  const apiUrl = `${config.url}/BatchJobList?Token=${claim?.token ?? ''}`

  const dataFn = async () => {
    try {
      const response = await serverGetFetch(`/BatchJobList?Token=${claim?.token ?? ''}`)
      if (response.ResponseCode && response.ResponseCode !== 'Success') {
        setError(true)
      }
      return response
    } catch (err) {
      throw new Error('not authenticated')
    }
  }

  const { data } = useSwrHelper<QlnApiResponse>(apiUrl, dataFn)

  const handleItemClicked = async (item: Job) => {
    setIsLoadingDetail(true)
    stop()
    const result = await getJob(claim?.token!, item.Name)
    setSelectedItem(result)
    setIsLoadingDetail(false)
  }
  const handleClose = () => {
    setSelectedItem(null)
    start()
  }

  useEffect(() => {
    if (!error) {
      mutate(apiUrl)
    } else {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, error])

  return (
    <Box>
      <>
        {error && (
          <Box py={2}>
            <AlertWithHeader severity='error' header='Error' text='authentication failed' />
          </Box>
        )}
        {error && <QlnUsernameLoginForm onSuccess={handleLogin} />}
        {isLoadingDetail && <BackdropLoader />}
        {selectedItem && <JobDetail item={selectedItem} onClose={handleClose} />}
        {data && claim && <JobList response={data} onJobSelected={handleItemClicked} />}
      </>
    </Box>
  )
}

export default JobsLayout
