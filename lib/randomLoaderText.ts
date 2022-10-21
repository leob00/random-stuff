import { shuffle } from 'lodash'

const loaders = [
  'shuffling cards',
  'getting things ready',
  'warming up',
  'generating random things',
  'doing laundry',
  'warming up the server',
  'computing lucky stars',
  'firing up the lambdas',
  'counting random bytes',
  'catching up on chores',
  'performing quick maintenace',
  'this is taking longer than normal',
]

export function getRandomLoadertext() {
  return shuffle(loaders)[0]
}
