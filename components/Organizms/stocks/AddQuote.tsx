import { Stack, Box } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'

const AddQuote = ({ quote, handleAddToList, handleCloseAddQuote }: { quote: StockQuote; handleAddToList: () => void; handleCloseAddQuote: () => void }) => {
  return (
    <>
      <StockListItem item={quote} expand={true} isStock={true} />
      <Stack py={1} direction={'row'} spacing={1}>
        <Stack flexGrow={1}>
          <Box textAlign={'right'}>
            <SecondaryButton text=' Add to list' size='small' onClick={handleAddToList}></SecondaryButton>
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
