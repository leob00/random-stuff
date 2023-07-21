import { Stack, Box, Typography, Alert } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockListItem from './StockListItem'

const AddQuote = ({
  quote,
  stockListMap,
  handleAddToList,
  handleCloseAddQuote,
  scrollIntoView = true,
}: {
  quote: StockQuote
  stockListMap: Map<string, StockQuote>
  handleAddToList: () => void
  handleCloseAddQuote: () => void
  scrollIntoView?: boolean
}) => {
  const alreadyExists = stockListMap.has(quote.Symbol)
  //console.log(stockListMap)
  return (
    <>
      <StockListItem
        item={quote}
        expand={true}
        isStock={true}
        closeOnCollapse={true}
        onClose={handleCloseAddQuote}
        showGroupName={true}
        scrollIntoView={scrollIntoView}
      />
      {alreadyExists && (
        <CenterStack>
          <Alert severity='success'>
            <Typography pr={2} variant='caption'>{`This stock already exists in your list`}</Typography>
          </Alert>
        </CenterStack>
      )}
      <Stack py={1} direction={'row'} spacing={1} alignItems='center'>
        <Stack flexGrow={1}>
          <Box textAlign={'right'}>{!alreadyExists && <SecondaryButton text='Add to list' size='small' onClick={handleAddToList}></SecondaryButton>}</Box>
        </Stack>
        <Stack>
          <PassiveButton text={'close'} onClick={handleCloseAddQuote} size='small' />
        </Stack>
      </Stack>
    </>
  )
}

export default AddQuote
