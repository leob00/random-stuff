import { Box, Button, Divider, Grid, Stack, Typography, Link } from '@mui/material'
import { BasicArticle } from 'lib/model'
import React from 'react'
import Layout from './Layout'
import router from 'next/router'
import { Bookmark } from '@mui/icons-material'
import { Save, ShareTwoTone, Download } from '@mui/icons-material'
import { isBrowser } from 'lib/auth'

const RandomAnimalLayout = ({ data, onRefresh, showNext = true }: { data: BasicArticle; onRefresh?: () => void; showNext?: boolean }) => {
  const handleNextClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }
  const handleDownloadClick = (imagePath: string | undefined) => {
    if (imagePath && isBrowser() === true) {
      let link = document.createElement('a')
      link.download = imagePath
      link.setAttribute('download', 'image.jpg')
      //link.setAttribute('download')
      link.href = imagePath
      //let blob = new Blob(['Hello, world!'])
      //link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    }
  }
  return (
    <>
      <Box>
        <Typography variant='h5'>{data.title}</Typography>
        <Divider />
        <Button
          variant='text'
          onClick={() => {
            router.back()
          }}>
          &#8592; back
        </Button>
      </Box>
      <Stack direction='row' justifyContent='center' my={3}>
        <img src={data.imagePath} alt='random dog' height={320} style={{ borderRadius: '.8rem' }} />
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
