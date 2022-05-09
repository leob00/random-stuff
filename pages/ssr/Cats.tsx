import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { getRandomCat } from 'lib/repo'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { BasicArticle } from 'lib/model'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let article: BasicArticle = {
    title: 'Cats',
    type: 'Cats',
  }
  fetch('/api/cats', {
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

const Cats: NextPage<{ data: BasicArticle }> = ({ data }) => {
  return <RandomAnimalLayout data={data} />
}

export default Cats
