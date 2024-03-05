// import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
// import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import { Box, Button, Typography } from '@mui/material'
import numeral from 'numeral'
import HorizontalDivider from './Dividers/HorizontalDivider'

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
    //setPageIndex(idx)
    onPaged(idx)
  }
  const handleNextClick = () => {
    let idx = pageIndex + 1
    //setPageIndex(idx)
    onPaged(idx)
  }
  const handleFirstPageClick = () => {
    //setPageIndex(1)
    onPaged(1)
  }
  const handleLastPageClick = () => {
    let idx = pageCount
    //setPageIndex(idx)
    onPaged(idx)
  }

  // useEffect(() => {
  //   const newMessage = getDisplayMessage(pageCount)
  //   setDisplayMessage(newMessage)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pageCount, pageIndex, itemCount])
  return (
    <Box pt={1}>
      {showHorizontalDivider && <HorizontalDivider />}
      {showPageText && (
        <Typography sx={{ my: 2, textAlign: 'center' }} variant='body2'>
          {displayMessage}
        </Typography>
      )}
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Button variant='text' disabled={pageIndex <= 1} onClick={handleFirstPageClick}>
          <FirstPageIcon />
        </Button>
        <Button variant='text' disabled={pageIndex <= 1} onClick={handlePreviousClick}>
          <KeyboardArrowLeft />
        </Button>
        <Button variant='text' onClick={handleNextClick} disabled={pageIndex === pageCount}>
          <KeyboardArrowRight />
        </Button>
        <Button variant='text' disabled={pageIndex === pageCount} onClick={handleLastPageClick}>
          <LastPageIcon />
        </Button>
      </Box>
    </Box>
  )
}

export default Pager
