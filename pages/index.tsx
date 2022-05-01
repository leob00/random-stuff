import type { NextPage } from 'next'
import NLink from 'next/link'
import Layout from 'components/Layout'
import { Box, Card, CardContent, Container, Grid, Link, List, ListItem, Paper, Typography } from '@mui/material'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Layout home>
      <main>
        <Box
          sx={{
            mt: 4,
            borderTopWidth: 3,
            //pt: 3,
            //pb: 3,
          }}>
          <Container sx={{ minHeight: '640px' }}>
            <h4>Home</h4>
            <Paper sx={{ paddingTop: '10px' }}>
              <Box sx={{ align: 'center', mx: 2 }}>
                {/* <Typography sx={{ textAlign: 'center' }}>
                  <Image priority src='/images/logo-with-text.png' width={340} height={250} alt='random things' style={{ borderRadius: '.6rem' }} />
                </Typography> */}
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
                          <NLink href='/csr/RandomDog' passHref>
                            <Link sx={{}} href='/'>
                              random dogs
                            </Link>
                          </NLink>
                        </ListItem>
                        <ListItem>
                          <NLink href='/csr/RandomCat' passHref>
                            <Link sx={{}} href='/'>
                              random cats
                            </Link>
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
                      </List>
                    </Grid>
                  </Grid>
                </Box>
                <br />
                <br />
              </Box>
            </Paper>
          </Container>
        </Box>
      </main>
    </Layout>
  )
}

export default Home
