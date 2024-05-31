import { createWorker } from 'tesseract.js'
export async function getTextFromImage(url: string) {
  try {
    const worker = await createWorker('eng')
    const ret = await worker.recognize(url, {})

    await worker.terminate()
    return ret.data
  } catch (err) {
    console.error(err)
    return {
      text: '',
    }
  }
}
