import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from '@mui/material'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import DraggableList from './DraggableList'
import Close from '@mui/icons-material/Close'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { getListFromMap, getMapFromArray } from 'lib/util/collectionsNative'
import EditableStockList from './EditableStockList'
import { searchWithinResults, StockLayoutModel } from './StockSearchLayout'
import EditStockGroupForm from 'components/Molecules/Forms/EditStockGroupForm'

const EditList = ({
  username,
  data,
  onPushChanges,
  onCancelEdit,
  onReorder,
  state,
  setState,
}: {
  username: string | null
  data: StockQuote[]
  onPushChanges: (quotes: StockQuote[]) => void
  onCancelEdit: () => void
  onReorder: (quotes: StockQuote[]) => void
  state: StockLayoutModel
  setState: React.Dispatch<StockLayoutModel>
}) => {
  const [originalData, setOriginalData] = React.useState(data)
  const [filtered, setFiltered] = React.useState(data)
  const [showEditSingleItem, setShowEditSingleItem] = React.useState(false)
  const [editItem, setEditItem] = React.useState<StockQuote | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)

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
    setShowEditSingleItem(true)
  }
  const handleSearched = (text: string) => {
    setFiltered(searchWithinResults(originalData, text))
  }
  const handleCloseEditSingleItem = () => {
    setEditItem(undefined)
    setShowEditSingleItem(false)
  }
  const handleSaveGroupName = async (text: string) => {
    // setIsLoading(true)
    const item = { ...editItem!, GroupName: text }
    setEditItem(item)
    const map = getMapFromArray(data, 'Symbol')
    map.set(item.Symbol, item)
    const newList = getListFromMap(map)
    setOriginalData(newList)
    setFiltered(newList)
    setShowEditSingleItem(false)
    onPushChanges(newList)
  }
  const handleRemoveItem = (id: string) => {
    setEditItem(undefined)
    const newQuotes = { ...originalData }.filter((i) => i.Symbol !== id)
    setFiltered(newQuotes)
    setOriginalData(newQuotes)
    onPushChanges(newQuotes)
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
      {isLoading ? (
        <></>
      ) : (
        <>
          {filtered.length < originalData.length ? (
            <EditableStockList items={filtered} handleRemoveItem={handleRemoveItem} handleEditSingleItem={handleEditSingleItem} />
          ) : (
            <Box>
              <DraggableList username={username} items={originalData} onPushChanges={onReorder} onEditSingleItem={handleEditSingleItem} />
            </Box>
          )}
        </>
      )}
      <Dialog
        open={showEditSingleItem}
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
          <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary'>
            You can assign a new group name or pick from existing ones.
          </DialogContentText>
          <Box py={4}>
            <EditStockGroupForm options={groups} onSubmitted={handleSaveGroupName} defaultValue={editItem?.GroupName!} />
          </Box>
        </DialogContent>
        <HorizontalDivider />
      </Dialog>
    </Box>
  )
}

export default EditList
