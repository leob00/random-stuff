import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { getRandomDog } from 'lib/repo'
import Layout from 'components/Layout'
import { BasicArticle } from 'lib/model'
import { Box, Container } from '@mui/material'
import Loader from 'components/Loader'

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

  return <>{item && <RandomAnimalLayout data={item} />}</>
}
export default RandomDog
