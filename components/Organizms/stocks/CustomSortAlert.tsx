import { Box, Alert, Button, AlertTitle, Typography, IconButton } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import { Sort } from 'lib/backend/api/aws/apiGateway'
import { SortableStockKeys } from 'lib/backend/api/models/zModels'
import React from 'react'
import CheckIcon from '@mui/icons-material/Check'

const CustomSortAlert = ({ result, onModify }: { result: Sort[]; onModify: () => void }) => {
  const translateSort = (sort: Sort) => {
    let direction = `${sort.direction === 'desc' ? 'largest to smallest' : 'smallest to largest'}`
    const key = sort.key as keyof SortableStockKeys
    let resultField = sort.key
    switch (key) {
      case 'ChangePercent':
        resultField = 'change percent'
        break
      case 'MarketCap':
        resultField = 'market cap'
        break
      case 'Company':
      case 'Symbol':
        direction = `${sort.direction === 'desc' ? 'Z-A' : 'A-Z'}`
        break
    }

    return `'${resultField}' (${direction})`
  }
  return (
    <Box py={2}>
      <Alert
        icon={<CheckIcon fontSize='inherit' />}
        severity='info'
        action={
          <Button color='secondary' size='small' onClick={onModify}>
            modify
          </Button>
        }
      >
        <AlertTitle>custom sort enabled</AlertTitle>
        {/* <Typography variant='body2'>{`sorted by ${translateSort(result[0])}`}</Typography> */}
      </Alert>
    </Box>
  )
}

export default CustomSortAlert