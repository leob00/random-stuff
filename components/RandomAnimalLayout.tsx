import { Box, Button, Divider, Stack, Typography, Link } from '@mui/material'
import { BasicArticle } from 'lib/model'
import React from 'react'
import router from 'next/router'
import { Download } from '@mui/icons-material'

const RandomAnimalLayout = ({ data, onRefresh, showNext = true }: { data: BasicArticle; onRefresh?: () => void; showNext?: boolean }) => {
  const handleNextClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <>
      <Box>
        <Button
          variant='text'
          onClick={() => {
            router.back()
          }}>
          &#8592; back
        </Button>
        <Typography variant='h5'>{data.title}</Typography>
        <Divider />
      </Box>
      <Stack direction='row' justifyContent='center' my={3}>
        <img src={data.imagePath} alt={data.title} height={320} style={{ borderRadius: '.8rem' }} />
      </Stack>
      {showNext && (
        <Box sx={{ textAlign: 'center' }}>
          <Button variant='outlined' onClick={handleNextClick}>
            Next
          </Button>
        </Box>
      )}
      <Stack direction='row' justifyContent='center' my={3}>
        <Link href={data.imagePath} target='_blank' download>
          <Download />
        </Link>
        {/* <Button
          variant='outlined'
          onClick={() => {
            handleDownloadClick(data.imagePath)
          }}>
          <Download />
        </Button> */}
      </Stack>
    </>
  )
}

export default RandomAnimalLayout
