import { Delete, Warning } from '@mui/icons-material'
import { Box, Stack, Button, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ExprationWarningTooltip from 'components/Atoms/Tooltips/ExprationWarningTooltip'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { UserNote } from 'lib/models/randomStuffModels'
import { take } from 'lodash'
import React from 'react'

const NoteList = ({ data, onClicked, onDelete }: { data: UserNote[]; onClicked: (item: UserNote) => void; onDelete: (item: UserNote) => void }) => {
  const [selectedNote, setSelectedNote] = React.useState<UserNote | null>(null)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [allData, setAllData] = React.useState(data)
  const [displayedData, setDisplayedData] = React.useState(take(data, 5))
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

  const handleShowMore = () => {
    setDisplayedData(allData)
  }

  return (
    <Box sx={{ py: 2 }}>
      <ConfirmDeleteDialog
        show={showConfirm}
        title={'confirm delete'}
        text={'Are you sure you want to delete this note?'}
        onConfirm={handleYesDelete}
        onCancel={() => {
          setShowConfirm(false)
        }}
      />
      <Box>
        {displayedData.map((item, i) => (
          <Box key={i} textAlign='left'>
            <Stack direction='row' flexGrow={1} gap={2} py={3} justifyContent='center' alignItems='center'>
              <LinkButton
                sx={{}}
                onClick={() => {
                  handleNoteTitleClick(item)
                }}
              >
                <Typography textAlign={'left'} variant='subtitle1'>
                  {item.title}
                </Typography>
              </LinkButton>
              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'center'} alignItems={'center'}>
                {item.expirationDate && (
                  <Stack pt={1}>
                    <ExprationWarningTooltip expirationDt={item.expirationDate}>
                      <Warning fontSize='small' color='warning' />
                    </ExprationWarningTooltip>
                  </Stack>
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
            {i < displayedData.length - 1 && <HorizontalDivider />}
          </Box>
        ))}
      </Box>
      {displayedData.length < allData.length && (
        <CenterStack sx={{ pt: 2 }}>
          <LinkButton onClick={handleShowMore}>show more...</LinkButton>
        </CenterStack>
      )}
    </Box>
  )
}

export default NoteList
