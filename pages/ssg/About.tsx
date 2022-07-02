import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Paper, Box, Typography } from '@mui/material'
import Image from 'next/image'

export const getStaticProps: GetStaticProps = async (context) => {
  //var data = await getYieldCurveData()
  return {
    props: {},
  }
}

const About: NextPage<{ data: any }> = ({ data }) => {
  return (
    <Container sx={{ minHeight: '640px' }}>
      <Typography variant='h5'>About Us</Typography>
      <Box sx={{ my: 2, paddingBottom: 3 }}>
        <Paper>
          <Box sx={{ align: 'center', my: 1 }}>
            <Typography sx={{ textAlign: 'center' }}>
              <Image priority src='/images/logo-with-text.png' width={340} height={250} alt='random things' style={{ borderRadius: '.6rem' }} />
            </Typography>
          </Box>
          <Box sx={{ align: 'center', my: 2 }}>
            <Typography variant='body2' align='center' gutterBottom>
              This site is dedicated to random foolishness and inconsequential musings. If you made it this far, it means there is no turning back any time soon. Sit back and relax and watch the grass grow, paint dry, or whatever else you find
              interesting.
              <br />
              Maybe consider embracing the Oxford comma...
            </Typography>
            <Typography sx={{ padding: 2 }}></Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default About
