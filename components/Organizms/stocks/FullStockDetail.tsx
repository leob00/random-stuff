import { Box, Button } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import StockListItem from './StockListItem'
import { StockQuote } from 'lib/backend/api/models/zModels'

const FullStockDetail = ({ item, onClose }: { item: StockQuote; onClose: () => void }) => {
  return (
    <Box py={2}>
      <ScrollIntoView />
      <Box py={2}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Button variant='text' onClick={onClose} color='primary'>
            &#8592; back
          </Button>
          <CloseIconButton onClicked={onClose} />
        </Box>
      </Box>
      <Box>
        <StockListItem item={item} isStock expand disabled scrollIntoView={false} />
      </Box>
    </Box>
  )
}

export default FullStockDetail
