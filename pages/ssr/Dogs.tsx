import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import RandomAnimal from 'components/RandomAnimalLayout'
import { getRandomDog } from 'lib/repo'
import { BasicArticle } from 'lib/model'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let article: BasicArticle = {
    title: 'Dogs',
    type: 'Dogs',
  }
  fetch('/api/dogs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => {
    resp.json().then((data) => {
      article = data as BasicArticle
    })
  })
  return {
    props: {
      data: article,
    },
  }
}

const Dogs: NextPage<{ data: BasicArticle }> = ({ data }) => {
  return <RandomAnimal data={data} />
}

export default Dogs
