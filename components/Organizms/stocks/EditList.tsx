import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, ListItemText, Stack, Typography } from '@mui/material'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import DraggableList from './DraggableList'
import { Close } from '@mui/icons-material'
import SearchAutoComplete from 'components/Atoms/Inputs/SearchAutoComplete'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { DropdownItem } from 'lib/models/dropdown'
import AutoCompleteSolo from 'components/Atoms/Inputs/AutoCompleteSolo'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SingleItemMenu from './SingleItemMenu'

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
  const [originalData] = React.useState(data)
  const [filtered, setFiltered] = React.useState(data)
  const [showEditSingleItem, setShowEditSingleItem] = React.useState(false)
  const [editItem, setEditItem] = React.useState<StockQuote | undefined>(undefined)

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
    const result = data.filter((o) => o.Symbol.toLowerCase().includes(text.toLowerCase()) || o.Company.toLowerCase().startsWith(text.toLowerCase()))
    setFiltered(result)
  }
  const handleCloseEditSingleItem = () => {
    setEditItem(undefined)

    setShowEditSingleItem(false)
  }
  const handleSelectGroupName = (text: string) => {
    console.log('text: ', text ?? '')
  }
  const handleRemoveItem = (id: string) => {
    setEditItem(undefined)
    const newQuotes = { ...originalData }.filter((i) => i.Symbol !== id)
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
      {filtered.length < data.length ? (
        <Box pt={4}>
          <HorizontalDivider />
          {filtered.map((item, i) => (
            <Box key={item.Symbol} py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <ListItemText primary={`${item.Company} (${item.Symbol})`} secondary={`Group name: ${item.GroupName ?? ''}`} />
              </Box>
              <Stack alignItems={'flex-end'} flexGrow={1} pr={2}>
                <SingleItemMenu onEdelete={handleRemoveItem} quote={item} onEdit={handleEditSingleItem} />
              </Stack>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          <DraggableList username={username} items={data} onPushChanges={onPushChanges} onEditSingleItem={handleEditSingleItem} />
        </Box>
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
            {/* <SearchAutoComplete defaultVal={editItem?.GroupName} label={'Group name'} searchResults={groups} onSelected={() => {}} /> */}
            <AutoCompleteSolo
              props={{
                defaultValue: editItem?.GroupName ?? '',
                label: 'Group Name',
                options: groups.map((o) => o.text),
                onSubmitted: handleSelectGroupName,
                width: 300,
              }}
            />
          </Box>
        </DialogContent>
        {/* <HorizontalDivider /> */}
      </Dialog>
    </Box>
  )
}

export default EditList
