export interface RouletteWheel {
  numbers: RouletteNumber[]
}

export interface RouletteNumber {
  value: string
  color: RouletteNumberColor
  odd: boolean
  even: boolean
}
export type RouletteNumberColor = 'red' | 'black' | 'zero' | 'doubleZero'

const populate = () => {
  let nums: RouletteNumber[] = []
  for (let i = 1; i < 37; i++) {
    //  The numbers alternate pairs of odd numbers with pairs of even numbers. The numbers also alternate between black and red.
    nums.push({
      color: i < 11 || (i >= 19 && i <= 28) ? (i % 2 == 0 ? 'black' : 'red') : i % 2 == 0 ? 'red' : 'black',
      value: i.toString(),
      odd: i % 2 == 0,
      even: i % 2 !== 0,
    })
  }
  return nums
}

export function getWheel() {
  let nums = populate()
  nums.push({ value: '00', color: 'doubleZero', odd: false, even: false })
  nums.push({ value: '0', color: 'zero', odd: false, even: false })
  const wheel: RouletteWheel = {
    numbers: nums,
  }
  return wheel
}
