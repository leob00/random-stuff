import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { getRandomCat, getRandomDog, getXkCd } from 'lib/repo'
import router from 'next/router'
import { BasicArticle } from 'lib/model'

const RandomAnimalLayout = ({ data, showNext = true }: { data: BasicArticle; showNext?: boolean }) => {
  const [item, setItem] = useState<BasicArticle | null>(data)

  const handleNextClick = async () => {
    let result: BasicArticle = {
      type: '',
      title: '',
    }
    if (!data) {
      return
    }

    switch (data.type) {
      case 'Dogs':
        result = await getRandomDog()
        break
      case 'Cats':
        result = await getRandomCat()
        break
      case 'DailySilliness':
        result = await getXkCd()
        break
    }
    setItem(result)
  }
  useEffect(() => {
    setItem(data)
  }, [])

  return (
    <Container sx={{ minHeight: '640px' }}>
      {item && (
        <>
          <Typography>
            <Button
              variant='text'
              sx={{ paddingLeft: '0px' }}
              onClick={() => {
                router.push('/')
              }}>
              &laquo; back
            </Button>
          </Typography>
          <Typography variant='h6' sx={{ paddingLeft: '20px', paddingBottom: '10px' }}>
            {item.title}
            <hr></hr>
          </Typography>

          <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
            {item && item.imagePath && item.imagePath.length > 0 && (
              <>
                <img src={item.imagePath} alt='Happy' height={320} width={320} style={{ borderRadius: '.8rem' }} />
                {showNext && (
                  <Typography sx={{ textAlign: 'center', padding: '10px' }}>
                    <Button variant='outlined' onClick={handleNextClick}>
                      Next
                    </Button>
                  </Typography>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  )
}

export default RandomAnimalLayout
