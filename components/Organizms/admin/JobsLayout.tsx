import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { Job, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import relativeTime from 'dayjs/plugin/relativeTime'
import JobDetail from './users/admin/jobs/JobDetail'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { mutate } from 'swr'
import JobList from './JobList'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSwrHelper } from 'hooks/useSwrHelper'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import { usePolling } from 'hooks/usePolling'
import { useEffect, useState } from 'react'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
dayjs.extend(relativeTime)

const JobsLayout = ({ userClaim }: { userClaim: Claim }) => {
  const pollingIterval = 7000
  const [selectedItem, setSelectedItem] = useState<Job | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [claim, setClaim] = useState<Claim | undefined>(userClaim)
  const { start, stop, pollCounter: counter } = usePolling(pollingIterval, 100)

  const handleLogin = async (result: Claim[]) => {
    setClaim(result.find((m) => m.type === 'qln'))
    setError(null)
    start()
  }

  const listMutateKey = `BatchJobList`

  const dataFn = async () => {
    try {
      const response = await serverGetFetch(`/BatchJobList?Token=${claim?.token ?? ''}`)
      if (response.ResponseCode && response.ResponseCode !== 'Success') {
        setError('failed getting batch job list')
      }
      return response
    } catch (err) {
      setError('not authenticated')
    }
  }

  const { data } = useSwrHelper(listMutateKey, dataFn)

  const handleItemClicked = async (item: Job) => {
    setIsLoadingDetail(true)
    stop()

    const url = `/BatchJobDetail?Token=${claim?.token ?? ''}&jobName=${item.Name}`
    const newResult = await serverGetFetch(url)
    setSelectedItem(newResult.Body as Job)
    setIsLoadingDetail(false)
  }

  const handleCloseDetail = () => {
    setSelectedItem(null)
    start()
  }
  useEffect(() => {
    if (!error) {
      mutate(listMutateKey)
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
        {/* {selectedItem && (
          <InfoDialog show={true} title={selectedItem.Description} onCancel={handleCloseDetail} fullScreen>
            <JobDetail item={selectedItem} />
          </InfoDialog>
        )} */}
        {data && claim && <JobList response={data} onJobSelected={handleItemClicked} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />}
      </>
    </Box>
  )
}

export default JobsLayout
