export function areObjectsEqual(object1?: any, object2?: any) {
  return JSON.stringify(object1) === JSON.stringify(object2)
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
