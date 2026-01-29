import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import SectorsTable from 'components/Organizms/stocks/SectorsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'

const Page = () => {
  const apiConn = apiConnection().qln
  const dataFn = async () => {
    const resp = await get(`${apiConn.url}/Industries`)
    return resp.Body as SectorIndustry[]
  }
  const { isLoading, data } = useSwrHelper('/api/baseUrl?id=industries', dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Seo pageTitle='Industries' />
      <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <StockReportsDropdown selectedValue='industries' />
        <Box pb={8}>{data && <SectorsTable data={data} category='Industry' />}</Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
