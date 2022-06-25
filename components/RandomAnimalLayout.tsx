import { Box, Button, Divider, Stack, Typography, Link } from '@mui/material'
import { BasicArticle } from 'lib/model'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Download } from '@mui/icons-material'
import RemoteImage from './Atoms/RemoteImage'

const RandomAnimalLayout = ({ data, onRefresh, showNext = true }: { data: BasicArticle; onRefresh?: () => void; showNext?: boolean }) => {
  const [isMounted, setIsMounted] = useState(false)
  let router = useRouter()
  const handleNextClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <Box>loading...</Box>
  }

  return (
    <>
      <Box>
        <Button
          variant='text'
          onClick={() => {
            router.push('/')
          }}>
          &#8592; back
        </Button>
        <Typography variant='h5'>{data.title}</Typography>
        <Divider />
      </Box>
      <Stack direction='row' justifyContent='center' my={2}>
        <RemoteImage url={data.imagePath} title={data.title} />
      </Stack>
      {showNext && isMounted && (
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
      </Stack>
    </>
  )
}

export default RandomAnimalLayout
