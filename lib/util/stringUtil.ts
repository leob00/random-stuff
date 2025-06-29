export function extractBracketValues(str: string) {
  const regex = /\[(.*?)\]/g
  const matches = str.match(regex)
  if (!matches) {
    return []
  }
  const result = matches.map((match) => {
    // Remove brackets and quotes
    return match.replace(/[\[\]'""]/g, '')
  })
  return result
}
