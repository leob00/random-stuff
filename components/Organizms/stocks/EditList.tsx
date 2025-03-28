import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { StockQuote } from 'lib/backend/api/models/zModels'
import DraggableList from './DraggableList'
import Close from '@mui/icons-material/Close'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import EditableStockList from './EditableStockList'
import { searchWithinResults } from './StockSearchLayout'
import EditStockGroupForm from 'components/Molecules/Forms/EditStockGroupForm'
import { useState } from 'react'

const EditList = ({
  username,
  data,
  onPushChanges,
  onCancelEdit,
  onReorder,
}: {
  username: string | null
  data: StockQuote[]
  onPushChanges: (quotes: StockQuote[]) => void
  onCancelEdit: () => void
  onReorder: (quotes: StockQuote[]) => void
}) => {
  const [originalData, setOriginalData] = useState(data)
  const [filtered, setFiltered] = useState(data)
  const [editItem, setEditItem] = useState<StockQuote | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const groupSet = new Set(
    data.map((o) => {
      return o.GroupName ?? ''
    }),
  )

  const groups: DropdownItem[] = Array.from(groupSet.values()).map((o) => {
    return {
      text: o,
      value: o,
    }
  })

  const handleEditSingleItem = (quote: StockQuote) => {
    setEditItem(quote)
  }
  const handleSearched = (text: string) => {
    setFiltered(searchWithinResults(originalData, text))
  }
  const handleCloseEditSingleItem = () => {
    setEditItem(null)
  }
  const handleSaveGroupName = (text: string) => {
    setIsLoading(true)
    setFiltered([])
    setOriginalData([])
    handleCloseEditSingleItem()
    const item = { ...editItem!, GroupName: text }
    const map = getMapFromArray(data, 'Symbol')
    map.set(item.Symbol, item)
    const newList = getListFromMap(map)
    onPushChanges(newList)

    setTimeout(() => {
      setOriginalData(newList)
      setFiltered(newList)

      setIsLoading(false)
    }, 500)
  }
  const handleRemoveItem = (id: string) => {
    handleCloseEditSingleItem()
    const newQuotes = [...originalData].filter((i) => i.Symbol !== id)
    setFiltered(newQuotes)
    setOriginalData(newQuotes)
    onPushChanges(newQuotes)
  }

  return (
    <>
      <Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <SearchWithinList onChanged={handleSearched} />
          </Box>
          <Box>
            <Button size='small' color='primary' onClick={onCancelEdit}>
              <Close fontSize='small' color='primary' />
            </Button>
          </Box>
        </Box>
        {filtered.length < originalData.length && !isLoading ? (
          <EditableStockList items={filtered} handleRemoveItem={handleRemoveItem} handleEditSingleItem={handleEditSingleItem} />
        ) : (
          <Box>{!isLoading && <DraggableList items={filtered} onPushChanges={onReorder} onEditSingleItem={handleEditSingleItem} isLoading={isLoading} />}</Box>
        )}
        {editItem && (
          <Dialog
            open={!!editItem}
            onClose={handleCloseEditSingleItem}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            maxWidth='lg'
          >
            <DialogTitle id='alert-dialog-title' sx={{ backgroundColor: CasinoBlueTransparent, color: 'white' }}>
              <Stack display='flex' direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Box>{editItem?.Company}</Box>
                <Box>
                  <IconButton onClick={handleCloseEditSingleItem} size='small'>
                    <Close fontSize='small' />
                  </IconButton>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }}>
                <Typography>You can assign a new group name or pick from existing ones.</Typography>
              </DialogContentText>
              <Box py={4}>
                <EditStockGroupForm options={groups} onSubmitted={handleSaveGroupName} defaultValue={editItem?.GroupName!} />
              </Box>
            </DialogContent>
            <HorizontalDivider />
          </Dialog>
        )}
      </Box>
    </>
  )
}

export default EditList
