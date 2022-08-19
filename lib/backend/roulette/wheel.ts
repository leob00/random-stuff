export interface RouletteWheel {
  numbers: RouletteNumber[]
}
export interface RouletteNumber {
  value: string
  color: RouletteNumberColor
}
export type RouletteNumberColor = 'red' | 'black' | 'green'

const populate = () => {
  let nums: RouletteNumber[] = []
  for (let i = 1; i < 37; i++) {
    // even : red, odd: black
    let color: RouletteNumberColor = 'red'

    nums.push({
      color: i < 11 || (i >= 19 && i <= 28) ? (i % 2 == 0 ? 'black' : 'red') : i % 2 == 0 ? 'red' : 'black',
      value: i.toString(),
    })
  }
  return nums
}

export function getWheel() {
  let nums = populate()
  nums.push({ value: '00', color: 'green' })
  nums.push({ value: '0', color: 'green' })
  const wheel: RouletteWheel = {
    numbers: nums,
  }
  return wheel
}
