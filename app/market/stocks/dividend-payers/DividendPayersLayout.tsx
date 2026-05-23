'use client'
import { Box } from '@mui/material'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import StockDividendsTable, { StockDividendItem } from 'components/Organizms/stocks/dividends/StockDividendsTable'
import StockReportsDropdown from 'components/Organizms/stocks/reports/StockReportsDropdown'
import SectorsTable from 'components/Organizms/stocks/SectorsTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'

const DividendPayersLayout = () => {
  const mutateKey = 'dividend-payers'
  const dataFn = async () => {
    const resp = await serverGetFetch(`/DividendPayers`)
    const result = resp.Body as StockDividendItem[]
    return sortArray(
      result.filter((m) => m.Frequency !== 'one-time'),
      ['AnnualYield'],
      ['desc'],
    )
  }
  const { isLoading, data } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <StockReportsDropdown selectedValue='dividend-payers' />
      {isLoading && <ComponentLoader />}
      <Box py={4}>{data && <StockDividendsTable data={data} />}</Box>
    </>
  )
}

export default DividendPayersLayout
