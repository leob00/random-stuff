import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import Layout from 'components/Layout'
import { BasicArticle } from 'lib/model'
import { Box, Button, Container, Typography } from '@mui/material'
import Image from 'next/image'
import router from 'next/router'

const RandomCat: NextPage = () => {
  const [item, setItem] = useState<BasicArticle | null>(null)

  const loadApiData = () => {
    fetch('/api/cats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => {
      resp.json().then((data) => {
        let article = data as BasicArticle
        setItem(article)
      })
    })
  }

  useEffect(() => {
    loadApiData()
  }, [])

  return (
    <Layout home>
      {item ? (
        <RandomAnimalLayout data={item} />
      ) : (
        <Container sx={{ minHeight: '640px' }}>
          <Typography variant='h6'></Typography>
          <Typography variant='body1'>
            <Button
              variant='text'
              onClick={() => {
                router.push('/')
              }}>
              &laquo; back
            </Button>
          </Typography>
          <hr></hr>
          <Box sx={{ textAlign: 'center' }}>{/* <Image src='/images/logo.png' alt='loading' height={320} width={320} style={{ borderRadius: '.8rem' }} placeholder='blur' blurDataURL='/images/logo.png'></Image> */}</Box>
        </Container>
      )}
    </Layout>
  )
}

export default RandomCat
