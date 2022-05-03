import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import Layout from 'components/Layout'
import { BasicArticle } from 'lib/model'
import { Box, Button, Container, Typography } from '@mui/material'
import Image from 'next/image'
import router from 'next/router'
import Loader from 'components/Loader'

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

  return <>{item && <RandomAnimalLayout data={item} />}</>
}

export default RandomCat
