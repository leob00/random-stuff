import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ManageJobLayout from 'components/Organizms/admin/jobs/ManageJobLayout'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { usePolling } from 'hooks/usePolling'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { Job, QlnApiRequest, serverGetFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { mutate } from 'swr'

const Page = () => {
  const router = useRouter()
  const id = router.query.slug as string
  const { claims } = useSessionStore()
  let claim = claims.find((m) => m.type === 'qln')
  const mutateKey = `/job/edit/${id}`

  const dataFn = async () => {
    const url = `/BatchJobDetail?Token=${claim?.token ?? ''}&jobName=${id}&loadChart=false`
    const result = await serverGetFetch(url)
    const job = result.Body as Job
    return job
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const { start, stop, pollCounter } = usePolling(10000, 100)

  const onSave = async (item: Job) => {
    const url = `/BatchJobDetail?Token=${claim?.token ?? ''}`
    const newItem = { ...item, NexRunDate: item.NextRunDate === 'Invalid Date' ? null : item.NextRunDate }
    const req: QlnApiRequest = {
      body: newItem,
    }
    mutate(mutateKey, newItem, { revalidate: false })
    await serverPostFetch(req, url)
  }

  useEffect(() => {
    mutate(mutateKey)
  }, [mutateKey, pollCounter])

  return (
    <RequireClaim claimType='rs-admin'>
      <ResponsiveContainer>
        <BackButton route='/protected/csr/admin' />
        {isLoading && !data && <BackdropLoader />}
        <Box minHeight={500}>{data && <ManageJobLayout data={data} onSave={onSave} />}</Box>
      </ResponsiveContainer>
    </RequireClaim>
  )
}

export default Page
