import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import SectorsTable from 'components/Organizms/stocks/SectorsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'

const Page = () => {
  const mutateKey = 'all-sectors'
  const dataFn = async () => {
    const resp = await serverGetFetch(`/Sectors`)
    return resp.Body as SectorIndustry[]
  }
  const { isLoading, data } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Sectors' />

      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
        <StockReportsDropdown selectedValue='sectors' />
        <Box pb={8}>{data && <SectorsTable data={data} category='Sector' />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
