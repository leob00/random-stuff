import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { BasicArticle } from 'lib/model'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { cloneDeep, shuffle } from 'lodash'
import { RandomStuffData } from 'lib/models/randomStuffModels'
import { buildRandomAnimals, getRandomAnimalsFromLocalFiles } from 'lib/backend/api/randomAnimalsApi'
import jsonData from '../../../public/data/randomStuff.json'

export const getStaticProps: GetStaticProps = async (context) => {
  const cmsRefreshIntervalSeconds = 360
  await buildRandomAnimals('dogs')
  let data = cloneDeep(jsonData) as RandomStuffData
  //console.log(JSON.stringify(articles))
  return {
    props: {
      //data: article,
      articles: shuffle(data.dogs),
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const RandomDogs: NextPage<{ articles: BasicArticle[] }> = ({ articles }) => {
  return <ArticlesLayout articles={articles} />
}

export default RandomDogs
