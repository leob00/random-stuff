export interface DropdownItem {
  text: string
  value: string
  disabled?: boolean
}

export function mapDropdownItems<T>(data: T[], text: keyof T, value: keyof T) {
  const result: DropdownItem[] = data.map((item) => {
    return { text: String(item[text]), value: String(item[value]) }
  })
  return result
}
export interface DropdownItemNumeric {
  text: string
  value: number
  disabled?: boolean
}
