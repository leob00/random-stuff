import { Box, Container, Paper, Typography, Grid, List, ListItem, Link } from '@mui/material'
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
                <Grid container>
                  <Grid item>
                    <List sx={{ listStyle: 'none' }}>
                      <ListItem>
                        <LinkButton
                          onClick={() => {
                            router.push('/ssg/randomdogs')
                          }}>
                          random dogs
                        </LinkButton>
                      </ListItem>
                      <ListItem>
                        <LinkButton
                          onClick={() => {
                            router.push('/ssg/randomcats')
                          }}>
                          random cats
                        </LinkButton>
                      </ListItem>
                      <ListItem>
                        <LinkButton
                          onClick={() => {
                            router.push('/ssg/articles')
                          }}>
                          random articles
                        </LinkButton>
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item>
                    <List sx={{ listStyle: 'none' }}>
                      <ListItem>
                        <LinkButton
                          onClick={() => {
                            router.push('/csr/DailySilliness')
                          }}>
                          daily silliness
                        </LinkButton>
                      </ListItem>
                      <ListItem>
                        <LinkButton
                          onClick={() => {
                            router.push('/ssg/recipes')
                          }}>
                          recipes
                        </LinkButton>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default HomeMenu
