import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { CatResponse, getRandomCat, getRandomDog } from 'lib/yieldCurveRepo'
import Layout from 'components/Layout'
import { Container, Typography, Button, Box } from '@mui/material'
import router from 'next/router'
import { title } from 'process'
import handler from 'pages/api/cats'
import { BasicArticle } from 'lib/model'

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

  return <Layout home>{item && <RandomAnimalLayout data={item} />}</Layout>
}

export default RandomCat
