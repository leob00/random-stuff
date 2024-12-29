import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CryptosDisplay from 'components/Organizms/crypto/CryptosDisplay'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'

const Page = () => {
  const mutateKey = 'cryptos-all'

  const dataFn = async () => {
    const resp = await serverGetFetch('/Crypto')
    const result = resp.Body as StockQuote[]
    return result
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const { userProfile, isValidating: profileLoading } = useProfileValidator()

  return (
    <ResponsiveContainer>
      <Box minHeight={500}>
        <PageHeader text='Cryptos' />
        {isLoading && <BackdropLoader />}
        {data && !profileLoading && <CryptosDisplay data={data} userProfile={userProfile} />}
      </Box>
    </ResponsiveContainer>
  )
}

export default Page
