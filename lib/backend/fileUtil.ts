import fs from 'fs'
import client from 'https'
import { getRandomDog } from 'lib/repo'

export function downloadImage(url: string, filepath: string) {
  client.get(url, (res) => {
    res.pipe(fs.createWriteStream(filepath))
  })
}

export async function downloadRandomDogImage() {
  let article = await getRandomDog()
  const fileName = article.imagePath.substring(article.imagePath.lastIndexOf('/'))
  downloadImage(article.imagePath, `D:Git\\next-react-projects\\random-stuffimages\\${fileName}`)
}
