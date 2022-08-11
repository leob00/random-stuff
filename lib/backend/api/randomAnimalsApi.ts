import { BasicArticle, BasicArticleTypes } from 'lib/model'
import { CatResponse, DogResponse } from 'lib/repo'
import fs from 'fs'
import { RandomStuffData } from 'lib/models/randomStuffModels'
import jsonData from '../../../public/data/randomStuff.json'
import { cloneDeep } from 'lodash'
import { putAnimals } from './apiGateway'

export async function getRandomDog() {
  let result: BasicArticle = {
    imagePath: '',
    type: 'dogs',
    title: 'Dogs',
  }
  try {
    let resp = await fetch(`https://dog.ceo/api/breeds/image/random`)
    let data = (await resp.json()) as DogResponse
    result.imagePath = data.message
    //console.log('retrieved random dog')
    return result
  } catch (error) {
    console.error(`api error ocurred: ${error}`)
    return result
  }
}

export async function buildRandomAnimals(type: BasicArticleTypes) {
  await getRandomAnimalsFromLocalFiles(type)
}

export async function getRandomAnimalsFromLocalFiles(type: BasicArticleTypes) {
  let basePath = ''
  let title = ''
  let targetPath = ''
  let data = cloneDeep(jsonData) as RandomStuffData
  //console.log(JSON.stringify(data))
  switch (type) {
    case 'cats':
      basePath = './public/images/randomCats'
      title = 'Cats'
      targetPath = '/images/randomCats/'
      break
    case 'dogs':
      basePath = './public/images/randomDogs'
      title = 'Dogs'
      targetPath = '/images/randomDogs/'
      break
  }

  let files = await fs.promises.readdir(basePath)
  console.log(`found ${files.length} ${title} files`)
  let mappedArticles: BasicArticle[] = files.map((item) => {
    return { type: type, title: title, imagePath: `${targetPath}${item}` }
  })
  await putAnimals(type, mappedArticles)

  switch (type) {
    case 'cats':
      data.cats = mappedArticles

      break
    case 'dogs':
      data.dogs = mappedArticles
      break
  }
  await writeToFile(data)

  return mappedArticles
}

export async function writeToFile(data: RandomStuffData) {
  //const jsonData = require('../../../public/data/randomStuff.json')
  /* const data = jsonData as RandomStuffData

  switch (type) {
    case 'cats':
      data.cats = shuffle(articles)
      break
    case 'dogs':
      data.dogs = shuffle(articles)
      break
  } */
  /* await fs.promises.writeFile('./public/data/randomStuff.json', JSON.stringify(data))
  console.log(`randomStuff.json updated`) */
}

export async function getRandomCat() {
  let result: BasicArticle = {
    imagePath: '',
    type: 'cats',
    title: 'Cats',
  }
  try {
    let resp = await fetch(`https://api.thecatapi.com/v1/images/search`)
    let data = (await resp.json()) as CatResponse[]

    if (data.length > 0) {
      result.imagePath = data[0].url
      //console.log('retrieved random cat')
    }
  } catch (error) {
    console.error(`api error ocurred: ${error}`)
    return result
  }

  return result
}
