import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EconDataDetails from 'components/Organizms/econ/EconDataDetails'
import EconDataLayout from 'components/Organizms/econ/EconDataLayout'
import Seo from 'components/Organizms/Seo'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = router.query.id
  const key = `economic-data-${id}`
  const dataFn = async () => {
    const startYear = searchParams?.get('startYear') as string
    const endYear = searchParams?.get('endYear') as string
    if (id && startYear && endYear) {
      const data = await getEconDataReport(Number(id), Number(startYear), Number(endYear))
      data.criteria = {
        id: String(data.InternalId),
        endYear: Number(endYear),
        startYear: Number(startYear),
      }

      return data
    }
    return undefined
  }
  const { data, isLoading } = useSwrHelper(key, dataFn, { revalidateOnFocus: false })

  return (
    <>
      <Seo pageTitle='Economic Data' />
      <ResponsiveContainer>
        <PageHeader text={'Economic Data'} backButtonRoute='/csr/economic-data' forceShowBackButton />
        {isLoading && <BackdropLoader />}
        {data && (
          <EconDataDetails
            item={data}
            onClose={() => {
              router.push('/csr/economic-data')
            }}
          />
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
