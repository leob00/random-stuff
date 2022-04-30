import type { NextPage } from 'next'
import NLink from 'next/link'
import Layout from 'components/Layout'
import { Box, Container, Link, Paper, Typography } from '@mui/material'

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
              <Paper sx={{ paddingTop: '40px' }}>
                <Box sx={{ align: 'center', mx: 2 }}>
                  <Typography variant='h5' align='center' gutterBottom>
                    Welcome to random stuff
                  </Typography>
                  <Typography variant='body2' align='center'>
                    You came to the right place to view random things to pass the time. Enjoy!
                  </Typography>
                  <Box>
                    <ul style={{ listStyle: 'none' }}>
                      <li>
                        <NLink href='/ssr/Dogs' passHref>
                          <Link href='/'>random dogs</Link>
                        </NLink>
                      </li>
                      <li>
                        <NLink href='/ssr/Cats' passHref>
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
