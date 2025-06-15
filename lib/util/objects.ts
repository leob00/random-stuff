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
type ComplexTye = {
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
