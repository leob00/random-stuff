import { ArrowBackIos, ArrowBackIosNewTwoTone, ArrowForwardIos } from '@mui/icons-material'
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Pager = ({ pageCount, itemCount, itemsPerPage, onPaged, defaultPageIndex = 1 }: { pageCount: number; itemCount: number; itemsPerPage: number; onPaged: (pageNum: number) => void; defaultPageIndex?: number }) => {
  const [pageIndex, setPageIndex] = useState(defaultPageIndex)
  const [displayMessage, setDisplayMessage] = useState('')

  const getDisplayMessage = (currIndex: number, totalPageCount: number) => {
    return `page ${currIndex} of ${totalPageCount}`
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
    setDisplayMessage(getDisplayMessage(defaultPageIndex, pageCount))
  }, [defaultPageIndex, displayMessage])
  return (
    <>
      <Divider />
      <Typography sx={{ my: 2, textAlign: 'left' }} variant='body2'>
        {displayMessage}
      </Typography>
      <Box sx={{ textAlign: 'center', my: 2 }}>
        {pageIndex > 1 ? (
          <>
            <Tooltip title='1st page'>
              <Button variant='text' disabled={pageIndex <= 1} onClick={handleFirstPageClick}>
                <ArrowBackIos sx={{ fontSize: 'smaller' }} />
                <ArrowBackIos sx={{ fontSize: 'smaller' }} />
              </Button>
            </Tooltip>
            <Tooltip title='previous'>
              <Button variant='text' disabled={pageIndex <= 1} onClick={handlePreviousClick}>
                <ArrowBackIos />
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Button variant='text' disabled={pageIndex <= 1} onClick={handleFirstPageClick}>
              <ArrowBackIos sx={{ fontSize: 'smaller' }} />
              <ArrowBackIos sx={{ fontSize: 'smaller' }} />
            </Button>
            <Button variant='text' disabled={pageIndex <= 1} onClick={handlePreviousClick}>
              <ArrowBackIos />
            </Button>
          </>
        )}
        {pageIndex < pageCount ? (
          <>
            <Tooltip title='next'>
              <Button variant='text' onClick={handleNextClick} disabled={pageIndex === pageCount}>
                <ArrowForwardIos />
              </Button>
            </Tooltip>
            <Tooltip title='last page'>
              <Button variant='text' disabled={pageIndex === pageCount} onClick={handleLastPageClick}>
                <ArrowForwardIos sx={{ fontSize: 'smaller' }} />
                <ArrowForwardIos sx={{ fontSize: 'smaller' }} />
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Button variant='text' onClick={handleNextClick} disabled={pageIndex === pageCount}>
              <ArrowForwardIos />
            </Button>
            <Button variant='text' disabled={pageIndex === pageCount} onClick={handleLastPageClick}>
              <ArrowForwardIos sx={{ fontSize: 'smaller' }} />
              <ArrowForwardIos sx={{ fontSize: 'smaller' }} />
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default Pager
