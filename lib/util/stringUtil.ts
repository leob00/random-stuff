export function findTextBetweenBrackets(text: string) {
  const regEx = new RegExp(/\[([^\][]*)]/gm)
  const matches = Array.from(text.matchAll(regEx))
  return matches
}
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

// Test examples console.log(extractBracketValues("['leo']['bob']")); // Output: ["leo", "bob"]
// console.log(extractBracketValues("['hello'][123]['world']")); // Output: ["hello", "123", "world"]
// console.log(extractBracketValues("[]")); // Output: [""]
// console.log(extractBracketValues("no brackets")); // Output: []
