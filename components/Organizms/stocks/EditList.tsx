import { Box, Button } from '@mui/material'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import DraggableList from './DraggableList'
import { Close } from '@mui/icons-material'

const EditList = ({
  username,
  data,
  onPushChanges,
  onCancelEdit,
}: {
  username: string | null
  data: StockQuote[]
  onPushChanges: (quotes: StockQuote[]) => void
  onCancelEdit: () => void
}) => {
  const [filtered, setFiltered] = React.useState(data)
  const handleSearched = (text: string) => {
    const result = data.filter((o) => o.Symbol.toLowerCase().includes(text.toLowerCase()) || o.Company.toLowerCase().startsWith(text.toLowerCase()))
    setFiltered(result)
  }
  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box>
          <SearchWithinList onChanged={handleSearched} />
        </Box>
        <Box>
          <Button size='small' color='secondary' onClick={onCancelEdit}>
            <Close fontSize='small' color='secondary' />
          </Button>
        </Box>
      </Box>
      {filtered.length < data.length ? (
        <Box>search occurred</Box>
      ) : (
        <Box>
          <DraggableList username={username} items={data} onCancelEdit={onCancelEdit} onPushChanges={onPushChanges} />
        </Box>
      )}
    </Box>
  )
}

export default EditList
