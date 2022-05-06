import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { BasicArticle } from 'lib/model'
import React from 'react'
import Layout from './Layout'
import router from 'next/router'

const RandomAnimalLayout = ({ data, onRefresh, showNext = true }: { data: BasicArticle; onRefresh?: () => void; showNext?: boolean }) => {
  const handleNextClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }
  return (
    <Layout>
      <Box>
        <Typography variant='h5'>{data.title}</Typography>
        <Divider />
        <Button
          variant='text'
          onClick={() => {
            router.back()
          }}>
          &#8592; back
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Grid item></Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid item>
            <Box>
              <Stack direction='row' justifyContent='center' my={3}>
                <img src={data.imagePath} alt='random dog' height={320} style={{ borderRadius: '.8rem' }} />
              </Stack>
              {showNext && (
                <Box sx={{ textAlign: 'center' }}>
                  <Button variant='outlined' onClick={handleNextClick}>
                    Next
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default RandomAnimalLayout
