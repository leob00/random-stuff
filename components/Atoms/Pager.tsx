import { Box, Stack, Typography } from '@mui/material'
import numeral from 'numeral'
import HorizontalDivider from './Dividers/HorizontalDivider'
import ArrowLeftButton from './Buttons/ArrowLeftButton'
import ArrowRightButton from './Buttons/ArrowRightButton'
import ArrowFirstPageButton from './Buttons/ArrowFirstPageButton'
import ArrowLastPageButton from './Buttons/ArrowLastPageButton'

const Pager = ({
  pageCount,
  itemCount,
  itemsPerPage,
  onPaged,
  defaultPageIndex = 1,
  showPageText = true,
  totalItemCount = 0,
  showHorizontalDivider = true,
}: {
  pageCount: number
  itemCount: number
  itemsPerPage: number
  onPaged: (pageNum: number) => void
  defaultPageIndex?: number
  showPageText?: boolean
  totalItemCount: number
  showHorizontalDivider?: boolean
}) => {
  const pageIndex = defaultPageIndex

  const getDisplayMessage = (totalPageCount: number) => {
    const pageMessage = `page ${pageIndex} of ${totalPageCount} `
    if (itemsPerPage === 1) {
      return pageMessage
    }

    const firstPage = pageIndex === 1
    const lastPage = pageIndex === totalPageCount
    if (firstPage) {
      if (totalItemCount <= itemsPerPage) {
        return `${pageMessage} [${pageIndex} - ${totalItemCount} of ${numeral(totalItemCount).format('###,###')}]`
      }

      return `${pageMessage} [${pageIndex} - ${pageIndex * itemsPerPage} of ${numeral(totalItemCount).format('###,###')}]`
    }
    if (lastPage) {
      if (itemCount === 1) {
        return `${pageMessage} [${totalItemCount - 1} - ${totalItemCount}]`
      }
      return `${pageMessage} [${totalItemCount - itemCount + 1} - ${totalItemCount}]`
    }
    let counter = pageIndex * itemCount
    if (counter > totalItemCount) {
      counter = totalItemCount
    }

    return `${pageMessage} [${(pageIndex - 1) * itemCount + 1} - ${counter} of ${numeral(totalItemCount).format('###,###')}]`
  }
  const displayMessage = getDisplayMessage(pageCount)

  const handlePreviousClick = () => {
    let idx = pageIndex - 1
    onPaged(idx)
  }
  const handleNextClick = () => {
    let idx = pageIndex + 1
    onPaged(idx)
  }
  const handleFirstPageClick = () => {
    onPaged(1)
  }
  const handleLastPageClick = () => {
    let idx = pageCount
    onPaged(idx)
  }

  return (
    <Box>
      {showHorizontalDivider && <HorizontalDivider />}
      {showPageText && (
        <Stack>
          <Typography textAlign='center' variant='caption'>
            {displayMessage}
          </Typography>
        </Stack>
      )}
      <Box textAlign={'center'} pt={1}>
        <ArrowFirstPageButton disabled={pageIndex <= 1} onClicked={handleFirstPageClick} />
        <ArrowLeftButton disabled={pageIndex <= 1} onClicked={handlePreviousClick} />
        <ArrowRightButton onClicked={handleNextClick} disabled={pageIndex === pageCount} />
        <ArrowLastPageButton disabled={pageIndex === pageCount} onClicked={handleLastPageClick} />
      </Box>
    </Box>
  )
}

export default Pager
