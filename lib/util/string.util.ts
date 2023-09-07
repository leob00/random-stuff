export function findTextBetweenBrackets(text: string) {
  const regEx = new RegExp(/(?<=\[).+?(?=\])/g)
  const matches = Array.from(text.matchAll(regEx))
  return matches
}
