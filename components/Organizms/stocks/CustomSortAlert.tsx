import { Box, Alert, Button, AlertTitle } from '@mui/material'
import { SortableStockKeys } from 'lib/backend/api/models/zModels'
import CheckIcon from '@mui/icons-material/Check'
import { Sort } from 'lib/backend/api/models/collections'

const CustomSortAlert = ({
  result,
  onModify,
  translateDefaultMessage = false,
}: {
  result: Sort[]
  onModify: () => void
  translateDefaultMessage?: boolean
}) => {
  const translateSort = (sort: Sort) => {
    let direction = `${sort.direction === 'desc' ? 'descending' : 'ascending'}`
    const key = sort.key as keyof SortableStockKeys
    let resultField = sort.key
    switch (key) {
      case 'ChangePercent':
        resultField = 'change percent'
        break
      case 'MarketCap':
        resultField = 'market cap'
        break
      default:
        resultField = key.toLowerCase()
        direction = direction
    }

    return `sorted by: ${resultField} (${direction})`
  }
  return (
    <Box py={2}>
      <Alert
        icon={<CheckIcon fontSize='inherit' />}
        severity='info'
        action={
          <Button color='primary' size='small' onClick={onModify}>
            modify
          </Button>
        }
      >
        <AlertTitle>{translateDefaultMessage ? translateSort(result[0]) : 'sorted'}</AlertTitle>
      </Alert>
    </Box>
  )
}

export default CustomSortAlert
