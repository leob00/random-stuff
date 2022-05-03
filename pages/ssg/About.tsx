import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { getYieldCurveData } from 'lib/repo'
import { Container, Paper, Box, Typography, Grid, Button } from '@mui/material'
import Image from 'next/image'
import Layout from 'components/Layout'
import router from 'next/router'

export const getStaticProps: GetStaticProps = async (context) => {
  var data = await getYieldCurveData()
  return {
    props: {
      data,
    },
  }
}

const About: NextPage<{ data: any }> = ({ data }) => {
  return (
    <Container sx={{ minHeight: '640px' }}>
      <h4>About Us</h4>
      <Paper sx={{ paddingTop: '10px' }}>
        <Box sx={{ align: 'center', mx: 2 }}>
          <Typography sx={{ textAlign: 'center' }}>
            <Image priority src='/images/logo-with-text.png' width={340} height={250} alt='random things' style={{ borderRadius: '.6rem' }} />
          </Typography>
          <Typography variant='body2' align='center' gutterBottom>
            This site is dedicated to random foolishness and inconsequential musings. If you made it this far, it means there is no turning back any time soon. Sit back and relax and watch the grass grow, paint dry, or whatever else you find interesting.
            <br />
            Maybe consider embracing the Oxford comma...
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Grid container alignItems='center'>
              <Grid item>
                <Button
                  variant='text'
                  onClick={() => {
                    router.push('/')
                  }}>
                  home
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='text'
                  onClick={() => {
                    router.push('/csr/RandomCat')
                  }}>
                  random cats
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant='text'
                  onClick={() => {
                    router.push('/csr/RandomDog')
                  }}>
                  random dogs
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography align='center' sx={{ padding: '10px' }}></Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default About
