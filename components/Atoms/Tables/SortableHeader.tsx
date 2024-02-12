import { Box, Button, IconButton, TableCell, Typography } from '@mui/material'
import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import SwapVertIcon from '@mui/icons-material/SwapVert'

const SortableHeaderCell = ({
  fieldName,
  displayText,
  sort,
  onChangeSort,
}: {
  fieldName: string
  displayText: string
  sort: Sort
  onChangeSort: (sort: Sort) => void
}) => {
  const handleChangeSort = () => {
    if (fieldName === sort.key) {
      onChangeSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
      return
    }
    onChangeSort({ ...sort, key: fieldName, direction: 'desc' })
  }
  return (
    <TableCell>
      <Box display={'flex'} alignItems={'center'} gap={1}>
        {fieldName === sort.key && (
          <>
            <Typography>{displayText}</Typography>
            <IconButton size='small' onClick={handleChangeSort} color='primary'>
              <>
                {fieldName === sort.key && <>{sort.direction === 'desc' ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowUpIcon />}</>}
                {fieldName !== sort.key && <SwapVertIcon />}
              </>
            </IconButton>
          </>
        )}
        {fieldName !== sort.key && (
          <>
            <Button size='small' onClick={handleChangeSort}>
              <Typography>{displayText}</Typography>
            </Button>
          </>
        )}
      </Box>
    </TableCell>
  )
}

export default SortableHeaderCell
