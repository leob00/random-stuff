import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Box, Button, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Pager = ({ pageCount, itemCount, itemsPerPage, onPaged }: { pageCount: number; itemCount: number; itemsPerPage: number; onPaged: (pageNum: number) => void }) => {
  const [pageIndex, setPageIndex] = useState(1)
  const [displayMessage, setDisplayMessage] = useState(`page 1 of ${pageCount}`)

  const handlePreviousClick = () => {
    let idx = pageIndex - 1
    setPageIndex(idx)
    //console.log(`page ${idx} of ${pageCount}`)
    setDisplayMessage(`page ${idx} of ${pageCount}`)
    onPaged(idx - 1)
  }
  const handleNextClick = () => {
    let idx = pageIndex + 1
    setPageIndex(idx)
    //console.log(`page ${idx} of ${pageCount}`)
    setDisplayMessage(`page ${idx} of ${pageCount}`)
    onPaged(idx - 1)
  }
  useEffect(() => {}, [])
  return (
    <>
      <Divider />
      <Typography sx={{ my: 2, textAlign: 'left' }} variant='body2'>
        {displayMessage}
      </Typography>
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Button variant='text' disabled={pageIndex <= 1} onClick={handlePreviousClick}>
          <ArrowBackIos />
        </Button>
        <Button variant='text' onClick={handleNextClick} disabled={pageIndex === pageCount}>
          <ArrowForwardIos />
        </Button>
      </Box>
    </>
  )
}

export default Pager
