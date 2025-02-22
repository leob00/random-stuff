import { Box } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { DateRangeFilter, StockEarningAggregate, serverGetFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import dayjs from 'dayjs'
import AnnualEarningsReport from './AnnualEarningsReport'

const AnnualEarningsReportWrapper = () => {
  const mutateKey = 'annual-earnings'
  const dataFn = async () => {
    const startDate = dayjs(new Date(dayjs().subtract(5, 'years').year(), 0, 1)).format()
    const range: DateRangeFilter = {
      startDate: startDate,
      endDate: dayjs().format(),
    }
    const resp = await serverPostFetch({ body: range }, '/EarningsReport')
    return resp.Body as StockEarningAggregate[]
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Box py={2}>
        {!isLoading && data && data.length === 0 && <NoDataFound />}
        {data && data.length > 0 && <AnnualEarningsReport apiData={data} />}
      </Box>
    </>
  )
}

export default AnnualEarningsReportWrapper
