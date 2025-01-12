import { Box, Typography } from '@mui/material'
import SecondaryCheckbox from 'components/Atoms/Inputs/SecondaryCheckbox'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import numeral from 'numeral'
import React from 'react'
import FileMenu from './FileMenu'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FadeIn from 'components/Atoms/Animations/FadeIn'
export const fileSizeDisplay = (bytes: number) => {
  const result = bytes / 1024
  if (result > 1000) {
    return `${numeral(result / 1024).format('###,###.00')} MB`
  }
  return `${numeral(result).format('###,###.00')} KB`
}
const S3FileRow = ({
  file,
  isEditEmode,
  onSelectFile,
  onViewFile,
  onDelete,
  onRename,
  onMovefile,
  showMoveFile = true,
  showFileAttributes,
}: {
  file: S3Object
  isEditEmode: boolean
  onSelectFile: (checked: boolean, item: S3Object) => void
  onViewFile: (item: S3Object) => void
  onDelete: (item: S3Object) => void
  onRename: (item: S3Object) => void
  onMovefile: (item: S3Object) => void
  showMoveFile?: boolean
  showFileAttributes?: boolean
}) => {
  return (
    <>
      {!isEditEmode ? (
        <Box px={1} py={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <FadeIn>
            <Typography>{file.filename.substring(0, file.filename.lastIndexOf('.'))}</Typography>
            {showFileAttributes && file.size && (
              <FadeIn>
                <Typography variant='caption'>{`size: ${fileSizeDisplay(file.size)}`}</Typography>
              </FadeIn>
            )}
          </FadeIn>

          <FadeIn>
            <FileMenu item={file} showMoveFile={showMoveFile} onView={onViewFile} onDelete={onDelete} onRename={onRename} onMovefile={onMovefile} />
          </FadeIn>
        </Box>
      ) : (
        <FadeIn>
          <Box px={1} py={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={1}>
              <Box>
                <SecondaryCheckbox
                  onChanged={(isChecked) => {
                    onSelectFile(isChecked, file)
                  }}
                />
              </Box>
              <FadeIn>
                <Typography>{file.filename}</Typography>
              </FadeIn>
            </Box>
            {showFileAttributes && file.size && (
              <Box display={'flex'} justifyContent={'flex-end'}>
                <FadeIn>
                  <Typography variant='caption' pl={2}>{`${fileSizeDisplay(file.size)}`}</Typography>
                </FadeIn>
              </Box>
            )}
          </Box>
        </FadeIn>
      )}
      <HorizontalDivider />
    </>
  )
}

export default S3FileRow
