import { Box, Container, Paper, Typography, Grid, List, ListItem, Link, Stack } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import NLink from 'next/link'
import React from 'react'
import router from 'next/router'
import CenterStack from 'components/Atoms/CenterStack'

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
          <CenterStack sx={{ my: 2 }}>
            <Typography variant='h5' align='center' gutterBottom>
              Welcome to random stuff
            </Typography>
          </CenterStack>
          <CenterStack sx={{ my: 2 }}>
            <Typography variant='body2' align='center'>
              You came to the right place to view random things. Enjoy!
            </Typography>
          </CenterStack>
          <Box>
            <CenterStack>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/randomdogs')
                }}>
                dogs
              </LinkButton>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/randomcats')
                }}>
                cats
              </LinkButton>
            </CenterStack>
            <CenterStack>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/articles')
                }}>
                blogs
              </LinkButton>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/waitandredirect?id=csr/DailySilliness')
                }}>
                daily silliness
              </LinkButton>
            </CenterStack>
            <CenterStack>
              <LinkButton
                onClick={() => {
                  router.push('/ssg/recipes')
                }}>
                recipes
              </LinkButton>
            </CenterStack>
          </Box>
          <CenterStack>
            <LinkButton
              onClick={() => {
                router.push('/ssg/coinflip')
              }}>
              flip coin
            </LinkButton>
            <LinkButton
              onClick={() => {
                router.push('/ssg/roulette')
              }}>
              spin wheel
            </LinkButton>
          </CenterStack>
          <CenterStack>
            <LinkButton
              onClick={() => {
                router.push('/ssg/news')
              }}>
              news
            </LinkButton>
          </CenterStack>
        </Container>
      </Box>
    </>
  )
}

export default HomeMenu
