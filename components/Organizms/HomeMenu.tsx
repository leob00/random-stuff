import { Box, Container, Paper, Typography, Grid, List, ListItem, Link } from '@mui/material'
import NLink from 'next/link'
import React from 'react'

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
                        <NLink href='/ssg/RandomDog' passHref>
                          <Link sx={{}} href='/'>
                            random dogs
                          </Link>
                        </NLink>
                      </ListItem>
                      <ListItem>
                        <NLink href='/ssg/RandomCat' passHref>
                          <Link sx={{}} href='/'>
                            random cats
                          </Link>
                        </NLink>
                      </ListItem>
                      <ListItem>
                        <NLink href='/ssg/articles' passHref>
                          <Link href='/'>random articles</Link>
                        </NLink>
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item>
                    <List sx={{ listStyle: 'none' }}>
                      <ListItem>
                        <NLink href='/csr/DailySilliness' passHref>
                          <Link href='/'>daily silliness</Link>
                        </NLink>
                      </ListItem>
                      <ListItem>
                        <NLink href='/ssg/recipes' passHref>
                          <Link href='/'>recipes</Link>
                        </NLink>
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
