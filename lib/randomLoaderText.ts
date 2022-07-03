import { shuffle } from 'lodash'

const loaders = ['shuffling cards', 'getting things ready', 'warming up', 'generating random things', 'doing laundry']

export function getRandomLoadertext() {
  return shuffle(loaders)[0]
}
