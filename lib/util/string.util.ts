export function findTextBetweenBrackets(text: string) {
  const regEx = new RegExp(/\[([^\][]*)]/gm)
  const matches = Array.from(text.matchAll(regEx))
  //console.log('matches: ', matches)
  return matches
}
