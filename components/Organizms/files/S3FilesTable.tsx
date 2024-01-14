import { Box, IconButton, Typography } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import RenameFileDialog from 'components/Molecules/Forms/Files/RenameFileDialog'
import ViewS3FileDialog from 'components/Molecules/Forms/Files/ViewS3FileDialog'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import { post, postBody, postDelete } from 'lib/backend/api/fetchFunctions'
import { renameS3File } from 'lib/backend/csr/nextApiWrapper'
import numeral from 'numeral'
import React from 'react'
import FileMenu from './FileMenu'
import S3Folder from './S3Folder'
import RefreshIcon from '@mui/icons-material/Refresh'

const S3FilesTable = ({
  data,
  readOnly = false,
  onMutated,
  onDeleted,
}: {
  data: S3Object[]
  readOnly?: boolean
  onMutated?: () => void
  onDeleted?: (item: S3Object) => void
}) => {
  const [itemToDelete, setItemToDelete] = React.useState<S3Object | null>(null)
  const [signedUrl, setSignedUrl] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<S3Object | null>(null)
  const [showRenameForm, setShowRenameForm] = React.useState(false)
  const [isMutating, setIsMutating] = React.useState(false)
  const [searchWithinList, setSearchWithinList] = React.useState('')

  const filterList = (items: S3Object[]) => {
    if (searchWithinList.length === 0) {
      return items
    }
    return items.filter((m) => m.filename.toLowerCase().includes(searchWithinList.toLowerCase()))
  }

  const results = filterList(data)

  const handleViewFile = async (item: S3Object) => {
    setIsMutating(true)
    const params = { bucket: item.bucket, fullPath: item.fullPath, expiration: 600 }
    const url = JSON.parse(await post(`/api/s3`, params)) as string
    setSignedUrl(url)
    setSelectedItem(item)
    setIsMutating(false)
  }
  const handleDelete = async (item: S3Object) => {
    setSignedUrl(null)
    setItemToDelete(item)
  }
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      const item = { ...itemToDelete }
      setItemToDelete(null)
      setIsMutating(true)
      await postDelete('/api/s3', item)
      setIsMutating(false)
      onDeleted?.(item)
      onMutated?.()
    }
  }

  const handleCancelViewFile = () => {
    setSelectedItem(null)
    setSignedUrl(null)
  }

  const handleOnRename = async (item: S3Object) => {
    setSelectedItem(item)
    setShowRenameForm(true)
  }

  const handleRenameFile = async (oldfilename: string, newfilename: string) => {
    if (selectedItem) {
      setShowRenameForm(false)
      setIsMutating(true)
      const oldPath = selectedItem.fullPath
      const newPath = `${selectedItem.fullPath.substring(0, selectedItem.fullPath.lastIndexOf('/'))}/${newfilename}`
      await renameS3File(selectedItem.bucket, oldPath, newPath)
      setIsMutating(false)
      setSearchWithinList('')
      onMutated?.()
    }
  }

  const fileSizeDisplay = (bytes: number) => {
    const result = bytes / 1024
    if (result > 1000) {
      return `${numeral(result / 1024).format('###,###.00')} MB`
    }
    return `${numeral(result).format('###,###.00')} KB`
  }

  return (
    <>
      {isMutating && <BackdropLoader />}

      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box> {data.length > 3 && <SearchWithinList onChanged={(text: string) => setSearchWithinList(text)} />}</Box>
        <Box>
          <IconButton
            size='small'
            color='primary'
            onClick={() => {
              onMutated?.()
            }}
          >
            <RefreshIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      {results.map((item) => (
        <Box key={item.fullPath}>
          <Box py={1}>
            <ListItemContainer>
              <Box px={1} py={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                  <Box>{!item.isFolder ? <Typography>{item.filename}</Typography> : <S3Folder path={item.filename} />}</Box>
                  {!item.isFolder && <Box>{item.size !== undefined && <Typography>{fileSizeDisplay(item.size)}</Typography>}</Box>}
                </Box>

                <Box>
                  <FileMenu item={item} onView={handleViewFile} onDelete={handleDelete} onRename={handleOnRename} />
                </Box>
              </Box>
            </ListItemContainer>
          </Box>
        </Box>
      ))}
      {itemToDelete && (
        <ConfirmDeleteDialog
          show={true}
          text={`Are you sure you want to delete ${itemToDelete.fullPath}?`}
          onCancel={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {signedUrl && selectedItem && <ViewS3FileDialog onCancel={handleCancelViewFile} signedUrl={signedUrl} filename={selectedItem.filename} />}
      {showRenameForm && <RenameFileDialog filename={selectedItem!.filename} onCancel={() => setShowRenameForm(false)} onSubmitted={handleRenameFile} />}
    </>
  )
}

export default S3FilesTable
