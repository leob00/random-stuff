import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse, StockEarning } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import useSWR, { Fetcher } from 'swr'
import EarningsCalendarDisplay from './earnings/EarningsCalendarDisplay'

const config = apiConnection().qln
const apiUrl = `${config.url}/RecentEarnings`
const fetcher: Fetcher<QlnApiResponse> = (url: string) => get(url)

const EarningsCalendarLayout = () => {
  const { data, isLoading, isValidating } = useSWR(apiUrl, fetcher)

  // const RenderDisplay = (apiResult: QlnApiResponse) => {
  //   const result = apiResult.Body as StockEarning[]
  //   const uniqueDates = orderBy(uniq(result.map((m) => m.ReportDate!)))
  //   const datesMap = new Map<string, StockEarning[]>()
  //   const dateOptions: DropdownItem[] = uniqueDates.map((item) => {
  //     return {
  //       text: `${dayjs(item).format('MM/DD/YYYY')}`,
  //       value: `${dayjs(item).format('MM/DD/YYYY')}`,
  //     }
  //   })
  //   const todayData = uniqueDates.find((m) => dayjs(m).format('MM/DD/YYYY') === dayjs().format('MM/DD/YYYY'))
  //   const dateToSelect = uniqueDates.length > 0 ? (todayData ? dayjs(todayData).format('MM/DD/YYYY') : uniqueDates[0]) : null

  //   uniqueDates.forEach((item) => {
  //     datesMap.set(
  //       item!,
  //       result.filter((m) => m.ReportDate === item),
  //     )
  //   })

  //   return (
  //     <Box pt={2}>
  //       {/* <Box display={'flex'} gap={1} alignItems={'center'} flexWrap={'wrap'} justifyContent='center'>
  //         {Array.from(datesMap.entries()).map(([key, values]) => (
  //           <Box key={key}>
  //             <Box py={1}>
  //               <Paper
  //                 component={Stack}
  //                 sx={{
  //                   minHeight: { xs: 180, sm: 160 },
  //                   p: 2,
  //                   width: { xs: 150, sm: 240 },
  //                   direction: 'column',
  //                   justifyContent: 'center',
  //                   backgroundColor: key === selectedDate ? (theme.palette.mode === 'dark' ? CasinoBlueTransparent : 'whitesmoke') : 'unset',
  //                 }}
  //               >
  //                 <Box textAlign={'center'}>
  //                   <Typography>{`${dayjs(key).format('MM/DD/YYYY')}`}</Typography>
  //                   <LinkButton2 onClick={() => handleDateClicked(key)}>{`${numeral(values.length).format('###,###')} earnings`}</LinkButton2>
  //                 </Box>
  //               </Paper>
  //             </Box>
  //           </Box>
  //         ))}
  //       </Box>
  //       {dateToSelect && data && (
  //         <Box pt={1}>
  //           <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -12 }}></Typography>
  //           <StockEarningsCalendarDetails data={filteredResults} />
  //         </Box>
  //       )} */}
  //     </Box>
  //   )
  // }

  return (
    <Box py={2}>
      {isValidating && <BackdropLoader />}
      {isLoading && <LargeGridSkeleton />}
      {!isLoading && data && data.Body.length === 0 && <NoDataFound />}
      {data && data.Body.length > 0 && <EarningsCalendarDisplay data={data.Body as StockEarning[]} />}
    </Box>
  )
}

export default EarningsCalendarLayout
