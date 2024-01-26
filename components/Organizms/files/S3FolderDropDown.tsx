import { Box, Typography } from '@mui/material'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import UncontrolledDropdownList from 'components/Atoms/Inputs/UncontrolledDropdownList'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const S3FolderDropDown = ({
  folders,
  folder,
  onFolderSelected,
}: {
  folders: DropdownItem[]
  folder: DropdownItem
  onFolderSelected: (val: string) => void
}) => {
  //const selectedFolder = folders.find((m) => m.value === folder.value) ?? folders[0]
  return (
    <Box display={'flex'} gap={2} alignItems={'center'}>
      <Typography>folder: </Typography>
      <UncontrolledDropdownList options={folders} selectedOption={folder.value} onOptionSelected={onFolderSelected} />
    </Box>
  )
}

export default S3FolderDropDown
