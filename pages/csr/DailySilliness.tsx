import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { Box, Typography } from '@mui/material'
import { BasicArticle } from 'lib/backend/api/aws/models/apiGatewayModels'

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
    <>
      <Box sx={{ minHeight: '640px' }}>{item && <RandomAnimalLayout data={item} showNext={false} />}</Box>
      <Typography align='center' variant='body2' sx={{ padding: '20px' }}>
        This content gets updated periodically depending on the Cloud...
      </Typography>
    </>
  )
}

export default DailySilliness
