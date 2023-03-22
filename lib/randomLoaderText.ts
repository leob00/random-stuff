import { shuffle } from 'lodash'

const loaders = [
  'shuffling cards',
  'getting things ready',
  'warming up',
  'generating random things',
  'doing laundry',
  'warming up the server',
  'counting lucky stars',
  'firing up the server',
  'counting random bytes',
  'catching up on chores',
  'performing quick maintenance',
  'counting beans',
  'turning on the stove',
  'setting up connections',
  'mixing ingredients',
  'contacting server',
  'waiting for response',
  'adding up numbers',
  'performing basic multiplication',
  'reading from the dictionary',
  'reorganizing',
  'buying ice cream',
  'waiting for a song to end',
  'catching up with friends',
  'waiting for a bus',
]

export function getRandomLoaderText() {
  return shuffle(loaders)[0]
}
