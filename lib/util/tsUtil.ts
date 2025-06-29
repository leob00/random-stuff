export function areObjectsEqual(object1?: any, object2?: any) {
  return JSON.stringify(object1) === JSON.stringify(object2)
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// extract example
type ExtractExample = 'a' | 'b' | 1 | 2
type Strings = Extract<ExtractExample, 'a' | 'b'>

// prettify example
type ComplexType = {
  a: string
  b: number
}

// mapped types
type MyFelxibleType = {
  name: string
  [key: string]: string | number
}

const t: MyFelxibleType = {
  name: 'foo',
  age: 2,
}

interface DogInfo {
  name: string
  age: number
}

type OptiopnFlags<T> = {
  [Property in keyof T]: null
}
type DogInfoOptions = OptiopnFlags<DogInfo>

const lg: DogInfo = {
  name: 'lg',
  age: 12,
}

type ExtractExample2 = 'a' | 'b' | 1 | 2
type Strings2 = Extract<ExtractExample2, 'a' | 'b'>

// prettify example
type ComplexType2 = {
  a: string
  b: number
}

// mapped types
type User = {
  id: string
  name: string
  age: number
}

type UserTransformed = {
  [K in keyof User]: {
    type: K
  }
}
