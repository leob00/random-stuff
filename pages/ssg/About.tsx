import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Paper, Box, Typography, Stack } from '@mui/material'
import logo from '/public/images/logo-with-text-blue-small.png'
import StaticImage from 'components/Atoms/StaticImage'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'

export const getStaticProps: GetStaticProps = async (context) => {
  //var data = await getYieldCurveData()
  return {
    props: {},
  }
}

const About: NextPage<{ data: any }> = ({ data }) => {
  return (
    <>
      <Seo pageTitle='About' />
      <ResponsiveContainer>
        <Typography variant='h5'>About Us</Typography>
        <Box sx={{ p: 2 }}>
          <Paper sx={{ p: 1 }}>
            <Box sx={{ align: 'center', my: 1 }}>
              <Stack direction='row' justifyContent='center' my={2}>
                <StaticImage image={logo} title='about us' height={220} width={340} />
              </Stack>
            </Box>
            <Box sx={{ align: 'center', my: 2 }}>
              <Typography variant='body2' align='center' gutterBottom>
                This site is dedicated to random foolishness and inconsequential musings. If you made it this far, it means there is no turning back any time
                soon. Sit back and relax and watch the grass grow, paint dry, or whatever else you find interesting.
                <br />
                Maybe consider embracing the Oxford comma...
              </Typography>
            </Box>
          </Paper>
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default About
