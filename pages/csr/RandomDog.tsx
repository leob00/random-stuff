import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { getRandomDog } from 'lib/yieldCurveRepo'
import Layout from 'components/Layout'
import { BasicArticle } from 'lib/model'
import { Box, Container } from '@mui/material'

const RandomDog: NextPage = () => {
  const [item, setItem] = useState<BasicArticle | null>(null)

  const loadApiData = () => {
    fetch('/api/dogs', {
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
export default RandomDog
