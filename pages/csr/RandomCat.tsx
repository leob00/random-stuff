import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { BasicArticle } from 'lib/model'

const RandomCat: NextPage = () => {
  const [item, setItem] = useState<BasicArticle | null>(null)

  const loadApiData = async () => {
    let resp = await fetch('/api/cats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let article = await resp.json()
    setItem(article)
  }
  const handleNext = async () => {
    await loadApiData()
  }

  useEffect(() => {
    const fn = async () => {
      loadApiData()
    }
    fn()
  }, [])

  return <>{item && <RandomAnimalLayout data={item} onRefresh={handleNext} />}</>
}

export default RandomCat
