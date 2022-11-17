import { Delete, Warning } from '@mui/icons-material'
import { Box, Stack, Button, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ExprationWarningTooltip from 'components/Atoms/Tooltips/ExprationWarningTooltip'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { UserNote } from 'lib/models/randomStuffModels'
import { take } from 'lodash'
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
  const [selectedNote, setSelectedNote] = React.useState<UserNote | null>(null)
  const [showConfirm, setShowConfirm] = React.useState(false)
  //const [displayedData, setDisplayedData] = React.useState(take(data, 5))
  const displayedData = take(data, 5)
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
    // setDisplayedData(data)
  }
  const handleShowLess = () => {
    //setDisplayedData(take(data, 5))
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
            <Stack direction='row' py={'3px'} justifyContent='center' alignItems='center'>
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

              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
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
            {i < data.length - 1 && <HorizontalDivider />}
          </Box>
        ))}
      </Box>
      {/* <CenterStack sx={{ pt: 2 }}>
        {displayedData.length < data.length ? (
          <LinkButton onClick={handleShowMore}>show more...</LinkButton>
        ) : (
          data.length > displayedData.length && <LinkButton onClick={handleShowLess}>show less...</LinkButton>
        )}
      </CenterStack> */}
    </Box>
  )
}

export default NoteList
