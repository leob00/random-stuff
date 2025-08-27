import { Box, Button } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import StockListItem from './StockListItem'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const FullStockDetail = ({ item, onClose, isStock }: { item: StockQuote; onClose: () => void; isStock?: boolean }) => {
  const { userProfile, isValidating } = useProfileValidator()
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
        {!isValidating && (
          <StockListItem key={item.Symbol} item={item} marketCategory='stocks' expand disabled scrollIntoView={false} userProfile={userProfile} />
        )}
      </Box>
    </Box>
  )
}

export default FullStockDetail
