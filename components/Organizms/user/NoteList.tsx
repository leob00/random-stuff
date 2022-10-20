import { Delete } from '@mui/icons-material'
import { Box, Stack, Button, Divider, Dialog, DialogTitle, DialogContent } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const NoteList = ({ data, onClicked, onDelete }: { data: UserNote[]; onClicked: (item: UserNote) => void; onDelete: (item: UserNote) => void }) => {
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
    <CenterStack sx={{ py: 2 }}>
      <Dialog open={showConfirm}>
        <DialogTitle>Delete Note?</DialogTitle>
        <DialogContent>
          <Button variant='outlined' color='error' onClick={handleYesDelete}>
            yes
          </Button>
          <Button
            sx={{ ml: 2 }}
            color='secondary'
            variant='outlined'
            onClick={() => {
              setShowConfirm(false)
            }}
          >
            no
          </Button>
        </DialogContent>
      </Dialog>
      <Box sx={{ width: '80%' }}>
        {data.map((item, i) => (
          <Box key={i}>
            <Stack direction='row' flexGrow={1} gap={2} py={3} pl={2}>
              <LinkButton
                onClick={() => {
                  handleNoteTitleClick(item)
                }}
              >
                {item.title}
              </LinkButton>
              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end'>
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
            <Divider />
          </Box>
        ))}
      </Box>
    </CenterStack>
  )
}

export default NoteList
