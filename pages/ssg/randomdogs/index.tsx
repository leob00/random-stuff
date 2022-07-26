import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { BasicArticle } from 'lib/model'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { cloneDeep, shuffle } from 'lodash'
import { RandomStuffData } from 'lib/models/randomStuffModels'
import { buildRandomAnimals, getRandomAnimalsFromLocalFiles } from 'lib/backend/api/randomAnimalsApi'
import jsonData from '../../../public/data/randomStuff.json'
import { isBrowser } from 'lib/util/system'

export const getStaticProps: GetStaticProps = async (context) => {
  const cmsRefreshIntervalSeconds = 360
  if (!isBrowser()) {
    await buildRandomAnimals('dogs')
  }
  let data = cloneDeep(jsonData) as RandomStuffData
  let result = shuffle(data.dogs)
  return {
    props: {
      //data: article,
      articles: result,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const RandomDogs: NextPage<{ articles: BasicArticle[] }> = ({ articles }) => {
  return <ArticlesLayout articles={articles} />
}

export default RandomDogs
