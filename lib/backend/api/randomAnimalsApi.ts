import { BasicArticle } from 'lib/model'
import { CatResponse, DogResponse } from 'lib/repo'
import fs from 'fs'
import { RandomStuffData } from 'lib/models/randomStuffModels'
import jsonData from '../../../public/data/randomStuff.json'
import { cloneDeep } from 'lodash'
import { DynamoKeys, putAnimals } from './aws/apiGateway'

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
    return result
  } catch (error) {
    console.error(`api error ocurred: ${error}`)
    return result
  }
}

export async function buildRandomAnimals(type: DynamoKeys) {
  await getRandomAnimalsFromLocalFiles(type)
}

export async function getRandomAnimalsFromLocalFiles(type: DynamoKeys) {
  let basePath = ''
  let title = ''
  let targetPath = ''
  let data = cloneDeep(jsonData) as RandomStuffData
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
  try {
    let files = await fs.promises.readdir(basePath)
    let mappedArticles: BasicArticle[] = files.map((item) => {
      return { type: type, title: title, imagePath: `${targetPath}${item}` }
    })

    //await putAnimals(type, mappedArticles)

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
  } catch (err) {
    console.error(err)
    let r: BasicArticle[] = []
    return r
  }
}

export async function writeToFile(data: RandomStuffData) {}

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
    }
  } catch (error) {
    console.error(`api error ocurred: ${error}`)
    return result
  }

  return result
}
