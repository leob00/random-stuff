import Delete from '@mui/icons-material/Delete'
import Warning from '@mui/icons-material/Warning'
import { Box, Stack, Button, useTheme } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { DarkBlue, ChartBackground } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { UserNote } from 'lib/models/randomStuffModels'
import { getExpirationText, getUtcNow } from 'lib/util/dateUtil'
import React from 'react'

const NoteList = ({
  data,
  onClicked,
  onAddNote,
  onDelete,
  isFiltered,
}: {
  data: UserNote[]
  onClicked: (item: UserNote) => void
  onAddNote: () => void
  onDelete: (item: UserNote) => void
  isFiltered: boolean
}) => {
  const theme = useTheme()
  const [selectedNote, setSelectedNote] = React.useState<UserNote | null>(null)
  const [showConfirm, setShowConfirm] = React.useState(false)
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

  return (
    <Box sx={{ py: 2 }}>
      {!isFiltered && (
        <Box>
          <Box sx={{ pb: 2 }}>
            <SecondaryButton text='add note' size='small' onClick={onAddNote} width={100} />
          </Box>
          <HorizontalDivider />
        </Box>
      )}
      <Box>
        {data.map((item, i) => (
          <Box key={i} textAlign='left'>
            <ListItemContainer>
              <Stack direction='row' py={1} alignItems='center'>
                <ListHeader
                  backgroundColor='transparent'
                  item={item}
                  text={item.title}
                  onClicked={(item: UserNote) => {
                    handleNoteTitleClick(item)
                  }}
                />
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
            </ListItemContainer>
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
