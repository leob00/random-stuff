import type { BasicArticle } from 'lib/model'

export interface DogResponse {
  message: string
}
export interface CatResponse {
  url: string
  description?: string
}
export interface XkCdResponse {
  month: string
  num: number
  link: string
  year: string
  news: string
  safe_title: string
  transcript: string
  alt: string
  img: string
  title: string
  day: string
}

export async function getXkCd() {
  let resp = await fetch(`https://xkcd.com/info.0.json`)
  let data = (await resp.json()) as XkCdResponse

  let result: BasicArticle = {
    type: 'DailySilliness',
    title: data.title,
    imagePath: data.img,
  }

  return result
}
