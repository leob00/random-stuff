import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { Box, Button, Container, Typography } from '@mui/material'
import { getRandomCat, getRandomDog, getXkCd } from 'lib/repo'
import router from 'next/router'
import Image from 'next/image'
import { BasicArticle } from 'lib/model'

const RandomAnimalLayout = ({ data, showNext = true }: { data: BasicArticle; showNext?: boolean }) => {
  const [item, setItem] = useState<BasicArticle | null>(data)

  const handleNextClick = async () => {
    let result: BasicArticle = {
      type: '',
      title: '',
    }
    if (!data) {
      return
    }

    switch (data.type) {
      case 'Dogs':
        result = await getRandomDog()
        break
      case 'Cats':
        result = await getRandomCat()
        break
      case 'DailySilliness':
        result = await getXkCd()
        break
    }
    setItem(result)
  }
  useEffect(() => {
    setItem(data)
  }, [])

  return (
    <Container sx={{ minHeight: '640px' }}>
      {item && (
        <>
          <h4>{item.title}</h4>
          <Typography variant='body1'>
            <Button
              variant='text'
              onClick={() => {
                router.push('/')
              }}>
              &laquo; back
            </Button>
          </Typography>
          <hr></hr>
          <Box sx={{ textAlign: 'center' }}>{item && item.imagePath && item.imagePath.length > 0 && <img src={item.imagePath} alt='Happy' height={320} width={320} style={{ borderRadius: '.8rem' }} />}</Box>
          {showNext && (
            <Typography sx={{ textAlign: 'center', padding: '10px' }}>
              <Button variant='outlined' onClick={handleNextClick}>
                Next
              </Button>
            </Typography>
          )}
        </>
      )}
    </Container>
  )
}

export default RandomAnimalLayout
