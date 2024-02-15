// import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
// import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import { Box, Button, Typography } from '@mui/material'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
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
  const [pageIndex, setPageIndex] = useState(defaultPageIndex)
  const [displayMessage, setDisplayMessage] = useState('')

  const getDisplayMessage = (currIndex: number, totalPageCount: number) => {
    const pageMessage = `page ${currIndex} of ${totalPageCount} `
    if (itemsPerPage === 1) {
      return pageMessage
    }

    const firstPage = currIndex === 1
    const lastPage = currIndex === totalPageCount
    if (firstPage) {
      return `${pageMessage} [${pageIndex} - ${pageIndex * itemCount} of ${numeral(totalItemCount).format('###,###')}]`
    }
    if (lastPage) {
      return `${pageMessage} [${totalItemCount - itemCount} - ${totalItemCount}]`
    }

    return `${pageMessage} [${(currIndex - 1) * itemCount + 1} - ${pageIndex * itemCount} of ${numeral(totalItemCount).format('###,###')}]`
  }

  const handlePreviousClick = () => {
    let idx = pageIndex - 1
    setPageIndex(idx)
    setDisplayMessage(getDisplayMessage(idx, pageCount))
    onPaged(idx)
  }
  const handleNextClick = () => {
    let idx = pageIndex + 1
    setPageIndex(idx)
    setDisplayMessage(getDisplayMessage(idx, pageCount))
    onPaged(idx)
  }
  const handleFirstPageClick = () => {
    setPageIndex(1)
    setDisplayMessage(getDisplayMessage(1, pageCount))
    onPaged(1)
  }
  const handleLastPageClick = () => {
    let idx = pageCount
    setPageIndex(idx)
    setDisplayMessage(getDisplayMessage(idx, idx))
    onPaged(idx)
  }

  useEffect(() => {
    setPageIndex(defaultPageIndex)
    const newMessage = getDisplayMessage(defaultPageIndex, pageCount)
    setDisplayMessage(newMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount, defaultPageIndex, totalItemCount, displayMessage])
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
