import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import Image from 'next/image'
import { getRandomDog } from 'lib/yieldCurveRepo'
import { width } from '@mui/system'

const YieldCurveLayout = ({ data }: { data: string }) => {
  const [dog, setDog] = useState(data)
  const handleNextClick = async () => {
    setDog(await getRandomDog())
  }

  return (
    <Layout>
      <Container sx={{ minHeight: '600px' }}>
        <h4>Dogs</h4>
        <Typography variant='body1' sx={{ padding: '5px' }}>
          the content below was created using SSR - Server Side Rendering
        </Typography>
        <hr></hr>
        <Box sx={{ textAlign: 'center' }}>
          <img src={dog} alt='Happy Dog' height={400} width={400} style={{ borderRadius: '.8rem' }} />
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

export default YieldCurveLayout
