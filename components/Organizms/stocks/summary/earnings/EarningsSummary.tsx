import { Box, Button, Typography, useTheme } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import SummaryTitle from '../SummaryTitle'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useState } from 'react'
import numeral from 'numeral'
import { getPositiveNegativeColor } from '../../StockListItem'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const EarningsSummary = ({ data, title }: { data: StockEarning[]; title: string }) => {
  const theme = useTheme()
  const palette = theme.palette.mode
  const [selectedItem, setSelectedItem] = useState<StockEarning | null>(null)
  return (
    <Box>
      <SummaryTitle title={title} />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Box minWidth={70} pl={1}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>actual</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>estimated</Typography>
          </Box>
        </Box>
      </Box>
      <ScrollableBox maxHeight={320}>
        <>
          {data.map((item) => (
            <Box key={item.Symbol}>
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <Button onClick={() => setSelectedItem(item)} sx={{ justifyContent: 'flex-start' }}>
                  <Typography>{item.Symbol}</Typography>
                </Button>
                <Box minWidth={80}>
                  <Typography
                    color={getPositiveNegativeColor(item.ActualEarnings, palette)}
                  >{`${numeral(item.ActualEarnings).format('###,###,0.00')}`}</Typography>
                </Box>
                <Box minWidth={80}>
                  <Typography
                    color={getPositiveNegativeColor(item.EstimatedEarnings, palette)}
                  >{`${numeral(item.EstimatedEarnings).format('###,###,0.00')}`}</Typography>
                </Box>
              </Box>
              <HorizontalDivider />
            </Box>
          ))}
        </>
      </ScrollableBox>
    </Box>
  )
}

export default EarningsSummary
