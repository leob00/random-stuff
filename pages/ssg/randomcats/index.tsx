import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { BasicArticle } from 'lib/model'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { cloneDeep, shuffle } from 'lodash'
import { buildRandomAnimals, getRandomAnimalsFromLocalFiles, writeToFile } from 'lib/backend/api/randomAnimalsApi'
import axios from 'axios'
import { RandomStuffData } from 'lib/models/randomStuffModels'
import jsonData from '../../../public/data/randomStuff.json'

export const getStaticProps: GetStaticProps = async (context) => {
  const cmsRefreshIntervalSeconds = 360
  await buildRandomAnimals('cats')
  let data = cloneDeep(jsonData) as RandomStuffData

  return {
    props: {
      //data: article,
      articles: shuffle(data.cats),
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const RandomCats: NextPage<{ articles: BasicArticle[] }> = ({ articles }) => {
  return <ArticlesLayout articles={articles} />
}

export default RandomCats
