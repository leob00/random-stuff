import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import OtherMarketsPageContextMenu from 'components/Molecules/Menus/OtherMarketsPageContextMenu'
import Seo from 'components/Organizms/Seo'
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
      <Seo pageTitle='Crypto' />
      <Box minHeight={500}>
        <PageHeader text='Crypto'>
          <OtherMarketsPageContextMenu />
        </PageHeader>
        {(isLoading || profileLoading) && <ComponentLoader />}
        <Box py={2} display={'flex'} justifyContent={'center'}>
          <AlertWithHeader severity='warning' header='' text='prices are delayed by one day' />
        </Box>
        {data && !profileLoading && <CryptosDisplay data={data} userProfile={userProfile} />}
      </Box>
    </ResponsiveContainer>
  )
}

export default Page
