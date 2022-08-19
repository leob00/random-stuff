import { Box, Container, Paper, Typography, Grid, List, ListItem, Link, Stack } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import NLink from 'next/link'
import React from 'react'
import router from 'next/router'

const HomeMenu = () => {
  return (
    <>
      <Box
        sx={{
          mt: 4,
          borderTopWidth: 3,
          //pt: 3,
          //pb: 3,
        }}>
        <Container>
          <Paper sx={{ paddingTop: '10px', marginTop: 2 }}>
            <Box sx={{ align: 'center', mx: 2, paddingBottom: 4 }}>
              <Typography variant='h5' align='center' gutterBottom>
                Welcome to random stuff
              </Typography>
              <Typography variant='body2' align='center'>
                You came to the right place to view random things. Enjoy!
              </Typography>
              <Box>
                <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                  <LinkButton
                    onClick={() => {
                      router.push('/ssg/randomdogs')
                    }}>
                    random dogs
                  </LinkButton>
                  <LinkButton
                    onClick={() => {
                      router.push('/ssg/randomcats')
                    }}>
                    random cats
                  </LinkButton>
                </Stack>
                <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                  <LinkButton
                    onClick={() => {
                      router.push('/ssg/articles')
                    }}>
                    random articles
                  </LinkButton>
                  <LinkButton
                    onClick={() => {
                      router.push('/ssg/waitandredirect?id=csr/DailySilliness')
                    }}>
                    daily silliness
                  </LinkButton>
                </Stack>
                <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                  <LinkButton
                    onClick={() => {
                      router.push('/ssg/recipes')
                    }}>
                    recipes
                  </LinkButton>
                </Stack>
                <Stack direction='row' justifyContent='center' sx={{ my: 2 }}></Stack>
              </Box>
              <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                <LinkButton
                  onClick={() => {
                    router.push('/ssg/coinflip')
                  }}>
                  flip a coin
                </LinkButton>
                <LinkButton
                  onClick={() => {
                    router.push('/ssg/roulette')
                  }}>
                  spin a wheel
                </LinkButton>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default HomeMenu
