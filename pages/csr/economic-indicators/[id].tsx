import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EconDataDetails from 'components/Organizms/econ/EconDataDetails'
import Seo from 'components/Organizms/Seo'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = router.query.id
  let startYear = searchParams?.get('startYear') as string | undefined
  let endYear = searchParams?.get('endYear') as string | undefined
  if (!startYear) {
    startYear = dayjs().subtract(5, 'year').year().toString()
  }
  if (!endYear) {
    endYear = dayjs().year().toString()
  }

  const key = `economic-data-${id}-${startYear}-${endYear}`
  const dataFn = async () => {
    if (id) {
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
      <Seo pageTitle='Economic Indicators' />
      <ResponsiveContainer>
        {isLoading && <BackdropLoader />}
        {data && (
          <>
            <PageHeader text={data.Title} backButtonRoute='/csr/economic-indicators' forceShowBackButton />
            <EconDataDetails
              item={data}
              onClose={() => {
                router.push('/csr/economic-indicators')
              }}
            />
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
