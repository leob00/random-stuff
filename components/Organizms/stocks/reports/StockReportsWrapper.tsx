import { Box } from '@mui/material'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import StockReportDisplay from '../StockReportDisplay'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

interface Model {
  type: StockReportTypes
  items: StockQuote[]
}
const StockReportsWrapper = ({ reportType }: { reportType: StockReportTypes }) => {
  const dataFn = async () => {
    const reportName = reportType.replaceAll('-', '') as StockReportTypes
    const result: Model = {
      type: reportName,
      items: [],
    }
    let take = 100
    if (reportName === 'indicesAndEtfs') {
      take = 2000
    }
    let days = 30
    const report = await serverGetFetch(`/StockReports?id=${reportName}&take=${take}&days=${days}`)
    result.items = report.Body as StockQuote[]

    return result
  }

  const { data, isLoading } = useSwrHelper(reportType, dataFn, { revalidateOnFocus: true })

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Box py={2}>{data && <StockReportDisplay data={data.items} reportType={data.type} />}</Box>
    </>
  )
}

export default StockReportsWrapper
