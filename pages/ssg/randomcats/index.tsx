import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { BasicArticle } from 'lib/model'
import fs from 'fs'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { shuffle } from 'lodash'

export const getStaticProps: GetStaticProps = async (context) => {
  const cmsRefreshIntervalSeconds = 3600
  const basePath = './public/images/randomCats'
  let files = await fs.promises.readdir(basePath)
  console.log(`found ${files.length} cat files`)
  let mappedArticles: BasicArticle[] = []
  files.forEach((file) => {
    mappedArticles.push({
      title: 'Cats',
      type: 'cats',
      imagePath: `/images/randomCats/${file}`,
    })
    console.log(`mapped cat: ${file}`)
  })
  let articles = shuffle(mappedArticles)
  return {
    props: {
      //data: article,
      articles: articles,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const RandomCats: NextPage<{ articles: BasicArticle[] }> = ({ articles }) => {
  const router = useRouter()
  const refreshData = () => {
    router.push('/ssr/RandomCat')
  }

  return <ArticlesLayout articles={articles} />
}

export default RandomCats
