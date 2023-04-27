import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import WarmupBox from 'components/Atoms/WarmupBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getFutures } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'

const FuturesLayout = () => {
  const [data, setData] = React.useState<StockQuote[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = async () => {
    const result = await getFutures()
    setData(result)
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData()
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box py={2}>
      {isLoading ? (
        <>
          <WarmupBox />
        </>
      ) : (
        <Box pt={2}>
          {data.map((item) => (
            <Box key={item.Symbol}>
              <ListHeader text={item.Company} item={item} onClicked={() => {}} />
              <Stack direction={'row'} spacing={1} sx={{ minWidth: '25%' }} pb={2} alignItems={'center'}>
                <Stack direction={'row'} spacing={2} pl={1} sx={{ backgroundColor: 'unset' }} pt={1}>
                  <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Price.toFixed(2)}`}</Typography>
                  <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.Change.toFixed(2)}`}</Typography>
                  <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(item.Change)}>{`${item.ChangePercent.toFixed(2)}%`}</Typography>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default FuturesLayout
