import { Box, Typography } from '@mui/material'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
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
  const handleSelected = (val: DropdownItem) => {
    onFolderSelected(val.value)
  }
  return (
    <Box display={'flex'} gap={2} alignItems={'center'}>
      <Typography>folder: </Typography>
      <StaticAutoComplete options={folders} onSelected={handleSelected} selectedItem={folder} />
    </Box>
  )
}

export default S3FolderDropDown
