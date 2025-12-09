import { Stack, Box, Typography, Alert } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import { StockQuote } from 'lib/backend/api/models/zModels'
import StockListItem from './StockListItem'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'

const AddQuote = ({
  quote,
  stockListMap,
  handleAddToList,
  handleCloseAddQuote,
  scrollIntoView = true,
  showAddToListButton = true,
  userProfile,
}: {
  quote: StockQuote
  stockListMap: Map<string, StockQuote>
  handleAddToList: (quote: StockQuote) => void
  handleCloseAddQuote: () => void
  scrollIntoView?: boolean
  showAddToListButton?: boolean
  userProfile: UserProfile | null
}) => {
  const alreadyExists = stockListMap.has(quote.Symbol)
  return (
    <>
      <Box display={'flex'} justifyContent={'flex-end'} py={1}>
        <CloseIconButton onClicked={handleCloseAddQuote} />
      </Box>
      <StockListItem
        item={quote}
        expand={true}
        marketCategory={'stocks'}
        showGroupName={true}
        scrollIntoView={scrollIntoView}
        userProfile={userProfile}
        disabled
      />
      {alreadyExists && showAddToListButton && (
        <CenterStack>
          <Alert severity='success'>
            <Typography pr={2} variant='caption'>{`This stock already exists in your list`}</Typography>
          </Alert>
        </CenterStack>
      )}
      <Stack py={1} direction={'row'} spacing={1} alignItems='center'>
        <Stack flexGrow={1}>
          <Box textAlign={'right'}>
            {!alreadyExists && showAddToListButton && (
              <PrimaryButton
                text='Add to list'
                size='small'
                onClick={() => {
                  handleAddToList(quote)
                }}
              />
            )}
          </Box>
        </Stack>
        <Stack>
          <PassiveButton text={'close'} onClick={handleCloseAddQuote} size='small' />
        </Stack>
      </Stack>
    </>
  )
}

export default AddQuote
