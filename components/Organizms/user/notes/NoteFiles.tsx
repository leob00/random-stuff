import { Box } from '@mui/material'
import S3FilesTable from 'components/Organizms/files/S3FilesTable'
import React from 'react'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAttach from 'components/Molecules/Menus/ContextMenuAttach'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'

const NoteFiles = ({ files, onMutated }: { files?: S3Object[]; onMutated: (items: S3Object[]) => void }) => {
  const [showAddFile, setShowAddFile] = React.useState(false)
  const onAddedFile = (item: S3Object) => {
    const items = !files ? [] : [...files].filter((m) => m.filename !== item.filename)
    items.push(item)
    setShowAddFile(false)
    onMutated(items)
  }
  const handleFileDeleted = (item: S3Object) => {
    const items = !files ? [] : [...files].filter((m) => m.filename !== item.filename)
    setShowAddFile(false)
    onMutated(items)
  }
  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuAttach />,
      fn: () => setShowAddFile(true),
    },
  ]
  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} py={2} justifyContent={'flex-end'}>
        <ContextMenu items={menu} />
      </Box>
      {/* {files && <S3FilesTable data={files} onDeleted={handleFileDeleted} />} */}

      {/* <FormDialog show={showAddFile} onCancel={() => setShowAddFile(false)} title={'add file'}>
        <S3FileUploadForm onUploaded={onAddedFile}></S3FileUploadForm>
      </FormDialog> */}
    </Box>
  )
}

export default NoteFiles
