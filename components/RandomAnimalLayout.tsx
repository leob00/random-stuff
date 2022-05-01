import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { Box, Button, Container, Typography } from '@mui/material'
import { getRandomCat, getRandomDog } from 'lib/yieldCurveRepo'
import router from 'next/router'
import Image from 'next/image'
import { BasicArticle } from 'lib/model'

const RandomAnimalLayout = ({ data }: { data: BasicArticle }) => {
  const [item, setItem] = useState(data)

  const handleNextClick = async () => {
    let result: BasicArticle = {
      type: item.type,
      title: item.title,
    }

    switch (data.type) {
      case 'Dogs':
        result = await getRandomDog()
        break
      case 'Cats':
        result = await getRandomCat()
        break
    }
    setItem(result)
  }

  return (
    <Container sx={{ minHeight: '640px' }}>
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
      <Box sx={{ textAlign: 'center' }}>{item.imagePath && item.imagePath.length > 0 && <img src={item.imagePath} alt='Happy Dog' height={320} width={320} style={{ borderRadius: '.8rem' }} />}</Box>
      <Typography sx={{ textAlign: 'center', padding: '10px' }}>
        <Button variant='outlined' onClick={handleNextClick}>
          Next
        </Button>
      </Typography>
    </Container>
  )
}

export default RandomAnimalLayout
