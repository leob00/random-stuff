import { shuffle } from 'lodash'

const loaders = ['shuffling', 'getting things ready', 'warming up', 'generating random things']

export function getRandomLoadertext() {
  return shuffle(loaders)[0]
}
