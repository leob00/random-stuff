import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EconDataDetails from 'components/Organizms/econ/EconDataDetails'
import EconDataLayout from 'components/Organizms/econ/EconDataLayout'
import Seo from 'components/Organizms/Seo'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  const id = router.query.id

  //console.log('id: ', id, ' startYear: ', startYear, ' endYear: ', endYear)

  const key = `economic-data-${id}`
  const dataFn = async () => {
    const startYear = router.query.startYear
    const endYear = router.query.endYear
    if (id && startYear && endYear) {
      const data = await getEconDataReport(Number(id), Number(startYear), Number(endYear))
      data.criteria = {
        id: String(data.InternalId),
        endYear: Number(startYear),
        startYear: Number(endYear),
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
        <PageHeader text={'Economic Data'} backButtonRoute='/csr/economic-data' />
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
