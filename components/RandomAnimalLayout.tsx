import React, { useState } from 'react'
import Layout from './Layout'
import { Box, Button, Container, Typography } from '@mui/material'
import { getRandomCat, getRandomDog } from 'lib/yieldCurveRepo'
import router from 'next/router'
import Image from 'next/image'

const RandomAnimalLayout = ({ data, title }: { data: string; title: string }) => {
  const [item, setItem] = useState(data)

  const handleNextClick = async () => {
    let result = ''
    switch (title) {
      case 'Dogs':
        result = await getRandomDog()
        break
      case 'Cats':
        result = await getRandomCat()
        break
    }
    //let result = await getRandom
    setItem(result)
  }

  return (
    <Layout>
      <Container sx={{ minHeight: '600px' }}>
        <h4>{title}</h4>
        <Typography variant='body1'>
          <Button
            variant='text'
            onClick={() => {
              router.push('/')
            }}>
            &laquo; back
          </Button>
        </Typography>
        {/* <Typography variant='body1' sx={{ padding: '5px' }}>
          the content below was created using SSR - Server Side Rendering
        </Typography> */}

        <hr></hr>
        <Box sx={{ textAlign: 'center' }}>
          {/* <Image src={item} alt='Happy Dog' height={400} width={400} style={{ borderRadius: '.8rem' }} placeholder='blur' blurDataURL={item} /> */}
          <img src={item} alt='Happy Dog' height={360} width={360} style={{ borderRadius: '.8rem' }} />
        </Box>
        <Typography sx={{ textAlign: 'center', padding: '10px' }}>
          <Button variant='outlined' onClick={handleNextClick}>
            Next
          </Button>
        </Typography>
      </Container>
    </Layout>
  )
}

export default RandomAnimalLayout
