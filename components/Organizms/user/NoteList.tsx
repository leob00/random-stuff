import Delete from '@mui/icons-material/Delete'
import Warning from '@mui/icons-material/Warning'
import { Box, Stack, Button, Typography } from '@mui/material'
import GradientContainer from 'components/Atoms/Boxes/GradientContainer'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import dayjs from 'dayjs'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getExpirationText, getUtcNow } from 'lib/util/dateUtil'
import numeral from 'numeral'
import React from 'react'

const NoteList = ({
  data,
  onClicked,
  onAddNote,
  onDelete,
}: {
  data: UserNote[]
  onClicked: (item: UserNote) => void
  onAddNote: () => void
  onDelete: (item: UserNote) => void
}) => {
  const [selectedNote, setSelectedNote] = React.useState<UserNote | null>(null)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [searchText, setSearchText] = React.useState('')
  const handleNoteTitleClick = (item: UserNote) => {
    onClicked(item)
  }
  const handleDeleteClick = (note: UserNote) => {
    setSelectedNote(note)
    setShowConfirm(true)
  }
  const handleYesDelete = () => {
    setShowConfirm(false)
    if (selectedNote) {
      onDelete(selectedNote)
    }
  }

  const handleSearched = (text: string) => {
    setSearchText(text)
  }
  const filterResults = () => {
    if (searchText.length > 0) {
      return data.filter((m) => m.title.toLowerCase().includes(searchText.toLowerCase()))
    }
    return [...data]
  }

  const filtered = filterResults()

  return (
    <Box sx={{ py: 2 }}>
      <Box>
        <Box sx={{ pb: 2 }} display={'flex'} gap={2}>
          <PrimaryButton text='add note' size='small' onClick={onAddNote} />
          <SearchWithinList text={`search ${numeral(data.length).format('###,###')} notes`} onChanged={handleSearched} />
        </Box>
        <HorizontalDivider />
      </Box>
      <Box>
        {filtered.map((item, i) => (
          <Box key={item.id}>
            <Box>
              <GradientContainer>
                <Stack direction='row' py={1}>
                  <Box sx={{}}>
                    <Button
                      size='large'
                      onClick={() => {
                        handleNoteTitleClick(item)
                      }}
                      //sx={{ width: '100%' }}
                    >
                      <Typography textAlign={'left'}>{item.title}</Typography>
                    </Button>
                  </Box>
                  <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
                    {item.expirationDate && dayjs(item.expirationDate).diff(getUtcNow(), 'day') < 2 && (
                      <Button size='small'>
                        <DefaultTooltip text={getExpirationText(item.expirationDate)}>
                          <Warning fontSize='small' color='primary' />
                        </DefaultTooltip>
                      </Button>
                    )}
                    <Button
                      size='small'
                      onClick={() => {
                        handleDeleteClick(item)
                      }}
                    >
                      <Delete color='error' />
                    </Button>
                  </Stack>
                </Stack>
              </GradientContainer>
            </Box>

            {i < data.length - 1 && <HorizontalDivider />}
          </Box>
        ))}
      </Box>
      {selectedNote && (
        <ConfirmDeleteDialog
          show={showConfirm}
          title={'confirm delete'}
          text={`Are you sure you want to delete ${selectedNote.title}?`}
          onConfirm={handleYesDelete}
          onCancel={() => {
            setShowConfirm(false)
          }}
        />
      )}
    </Box>
  )
}

export default NoteList
