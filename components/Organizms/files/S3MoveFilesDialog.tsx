import { Box, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const S3MoveFilesDialog = ({
  show,
  targetFolders,
  targetFolder,
  selectedFiles,
  onSelectTargetFolder,
  onMoveItems,
  onClose,
}: {
  show: boolean
  targetFolders: DropdownItem[]
  targetFolder: DropdownItem | null
  selectedFiles: S3Object[]
  onSelectTargetFolder: (val: string) => void
  onMoveItems: () => void
  onClose: () => void
}) => {
  return (
    <FormDialog show={show} onCancel={onClose} title={'move files'} showActionButtons>
      <CenterStack>
        <Typography>{`Move ${selectedFiles.length} files to folder of your choice:`}</Typography>
      </CenterStack>
      {targetFolder && (
        <Box py={2}>
          <DropdownList options={targetFolders} selectedOption={targetFolder.value} onOptionSelected={onSelectTargetFolder} fullWidth />
        </Box>
      )}
      <Box pb={2}>
        <CenterStack>
          <PrimaryButton text='move' onClick={onMoveItems} />
        </CenterStack>
      </Box>
    </FormDialog>
  )
}

export default S3MoveFilesDialog
