import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import dayjs from 'dayjs'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuClose from 'components/Molecules/Menus/ContextMenuClose'
import { S3Object, UserNote, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ContextMenuShare from 'components/Molecules/Menus/ContextMenuShare'
import { useRouter } from 'next/navigation'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { useState } from 'react'
import S3ManageFiles from '../files/S3ManageFiles'

const ViewNote = ({
  userProfile,
  selectedNote,
  onEdit,
  onCancel,
  onDelete,
  onFilesChanged,
}: {
  userProfile: UserProfile
  selectedNote: UserNote
  onEdit: (item: UserNote) => void
  onCancel: () => void
  onDelete: (note: UserNote) => void
  onFilesChanged: (files: S3Object[]) => void
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const router = useRouter()

  const handleYesDelete = () => {
    setShowConfirmDelete(false)
    onDelete(selectedNote)
  }
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuClose />,
      fn: onCancel,
    },
    {
      item: <ContextMenuEdit />,
      fn: () => onEdit(selectedNote),
    },
    {
      item: <ContextMenuShare />,
      fn: () => {
        router.push(`/protected/csr/notes/share/${encodeURIComponent(weakEncrypt(selectedNote.id!))}`)
      },
    },
    {
      item: <ContextMenuDelete />,
      fn: () => setShowConfirmDelete(true),
    },
  ]
  const folderPath = `${userProfile!.username}/user-notes/${selectedNote.id}`

  return (
    <>
      <Box sx={{ py: 1 }}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <ContextMenu items={menu} />
        </Box>
        <ScrollableBox maxHeight={500}>
          <HtmlView html={selectedNote.body} textAlign='left' />
        </ScrollableBox>
        {selectedNote.expirationDate && (
          <CenterStack>
            <Stack sx={{ py: 4 }} display={'flex'} direction={'row'} justifyItems={'center'}>
              <RecordExpirationWarning expirationDate={selectedNote.expirationDate} />
            </Stack>
          </CenterStack>
        )}
      </Box>
      {!selectedNote.expirationDate && (
        <S3ManageFiles displayName='note files' folderPath={folderPath} files={selectedNote.files} onFilesMutated={onFilesChanged} />
      )}
      <HorizontalDivider />
      {selectedNote.dateCreated && (
        <Box>
          <Typography variant='caption'>{`created: ${dayjs(selectedNote.dateCreated).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </Box>
      )}
      {selectedNote.dateModified && (
        <Box>
          <Typography variant='caption'>{`updated: ${dayjs(selectedNote.dateModified).format('MM/DD/YYYY hh:mm a')}`}</Typography>
        </Box>
      )}
      <ConfirmDeleteDialog
        show={showConfirmDelete}
        title={'confirm delete'}
        text={'Are you sure you want to remove this note?'}
        onConfirm={handleYesDelete}
        onCancel={() => {
          setShowConfirmDelete(false)
        }}
      />
    </>
  )
}

export default ViewNote
