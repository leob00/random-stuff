import { Box, Typography } from '@mui/material'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import numeral from 'numeral'
import React from 'react'
import FileMenu from './FileMenu'

const S3FileRow = ({
  file,
  isEditEmode,
  onSelectFile,
  onViewFile,
  onDelete,
  onRename,
}: {
  file: S3Object
  isEditEmode: boolean
  onSelectFile: (checked: boolean, item: S3Object) => void
  onViewFile: (item: S3Object) => void
  onDelete: (item: S3Object) => void
  onRename: (item: S3Object) => void
}) => {
  const fileSizeDisplay = (bytes: number) => {
    const result = bytes / 1024
    if (result > 1000) {
      return `${numeral(result / 1024).format('###,###.00')} MB`
    }
    return `${numeral(result).format('###,###.00')} KB`
  }

  return (
    <ListItemContainer>
      <Box px={1} py={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={1}>
          {isEditEmode && (
            <Box>
              <SecondaryCheckbox
                onChanged={(isChecked) => {
                  onSelectFile(isChecked, file)
                }}
              />
            </Box>
          )}
          <Typography>{isEditEmode ? file.filename : file.filename.substring(0, file.filename.lastIndexOf('.'))}</Typography>
          {isEditEmode && file.size !== undefined && <Typography pl={2}>{`${fileSizeDisplay(file.size)}`}</Typography>}
        </Box>
        <Box>{!isEditEmode && <FileMenu item={file} onView={onViewFile} onDelete={onDelete} onRename={onRename} />}</Box>
      </Box>
    </ListItemContainer>
  )
}

export default S3FileRow
