import type { NextPage } from 'next'
import NLink from 'next/link'
// import router from 'next/router'
// import { isLoggedIn } from 'lib/auth'
// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '/styles/Home.module.css'
import Layout from 'components/Layout'
import { Box, Button, Card, CardContent, Container, Link, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Layout home>
      <main>
        <Box
          sx={{
            mt: 10,
            borderTopWidth: 3,
            pt: 5,
            pb: 5,
          }}>
          <Container maxWidth='lg'>
            <Container>
              <Paper sx={{}}>
                <Box sx={{ align: 'center', mx: 2 }}>
                  <Typography variant='h5' align='center' gutterBottom>
                    Welcome to random stuff
                  </Typography>
                  <Typography variant='body2'>You came to the right place to view random things to pass the time. Enjoy!</Typography>
                  <Box>
                    <ul style={{ listStyle: 'none' }}>
                      <li>
                        <NLink href='/ssr/Dogs' passHref>
                          <Link href='/'>random dogs</Link>
                        </NLink>
                      </li>
                      <li>
                        <NLink href='/ssr/Dogs' passHref>
                          <Link href='/'>random cats</Link>
                        </NLink>
                      </li>
                    </ul>
                  </Box>
                  <br />
                  <br />
                </Box>
              </Paper>
            </Container>
          </Container>
        </Box>
        <Box sx={{ height: 200 }}></Box>
      </main>
    </Layout>
  )
}

export default Home
