'use client'
import { Box } from '@mui/material'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import SectorsTable from 'components/Organizms/stocks/SectorsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'

const IndustriesLayout = () => {
  const mutateKey = 'all-industries'
  const dataFn = async () => {
    const resp = await serverGetFetch(`/Industries`)
    return resp.Body as SectorIndustry[]
  }
  const { isLoading, data } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <StockReportsDropdown selectedValue='industries' />
      {isLoading && <ComponentLoader />}
      <Box pb={8}>{data && <SectorsTable data={data} category='Industry' />}</Box>
    </>
  )
}

export default IndustriesLayout
