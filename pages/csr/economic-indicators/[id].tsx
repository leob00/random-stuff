import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconomyPageContextMenu from 'components/Molecules/Menus/EconomyPageContextMenu'
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
  let ret = searchParams?.get('ret') as string | undefined
  if (ret) {
    ret = decodeURIComponent(ret)
  }
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

  const handleCoseClick = () => {
    if (ret) {
      router.push(ret)
    } else {
      router.push('/economy/indicators')
    }
  }

  return (
    <>
      <Seo pageTitle='Economic Indicators' />

      <ResponsiveContainer>
        <PageHeader text={data?.Title ?? ''}>
          <EconomyPageContextMenu />
        </PageHeader>
        {isLoading && <ComponentLoader />}
        <Box py={2} display={'flex'} justifyContent={'flex-end'}>
          <CloseIconButton onClicked={handleCoseClick} />
        </Box>

        {data && (
          <>
            <EconDataDetails item={data} onClose={handleCoseClick} />
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
