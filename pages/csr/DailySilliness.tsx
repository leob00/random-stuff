import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import Layout from 'components/Layout'
import { BasicArticle } from 'lib/model'
import { Box, Container, Typography } from '@mui/material'

const DailySilliness: NextPage = () => {
  const [item, setItem] = useState<BasicArticle | null>(null)

  const loadApiData = () => {
    fetch('/api/xkcd', {
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
      <Box sx={{ minHeight: '640px' }}>{item && <RandomAnimalLayout data={item} showNext={false} />}</Box>
      <Typography align='center' variant='body2' sx={{ padding: '20px' }}>
        This content gets updated periodically depending on the Cloud...
      </Typography>
    </Layout>
  )
}

export default DailySilliness
