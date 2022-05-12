import { Box, Button, Divider, Grid, Stack, Typography, Link } from '@mui/material'
import { BasicArticle } from 'lib/model'
import React from 'react'
import Layout from './Layout'
import router from 'next/router'
import { Bookmark } from '@mui/icons-material'
import { Save, ShareTwoTone, Download } from '@mui/icons-material'
import { isBrowser } from 'lib/auth'
import axios from 'axios'

const RandomAnimalLayout = ({ data, onRefresh, showNext = true }: { data: BasicArticle; onRefresh?: () => void; showNext?: boolean }) => {
  const handleNextClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }
  const handleDownloadClick = async (imagePath: string | undefined) => {
    if (imagePath && isBrowser() === true) {
      //debugger
      /* let resp = await axios.get(imagePath, { method: 'GET', headers: {}, responseType: 'blob' })
      let buffer = await resp.data
      const url = window.URL.createObjectURL(new Blob([buffer]))
      const link = document.createElement('a')
      link.href = url
      let fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1)
      link.setAttribute('download', fileName) //or any other extension
      document.body.appendChild(link)
      link.click() */
      /* let link = document.createElement('a')
      link.download = imagePath
      link.setAttribute('download', 'image.jpg')
      link.setAttribute('target', '_blank')      
      link.href = imagePath     
      link.click()
      URL.revokeObjectURL(link.href) */
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
