import StaticStockSearch from 'components/Atoms/Inputs/StaticStockSearch'
import { DropdownItem } from 'lib/models/dropdown'
import { forwardRef } from 'react'

type Props = {
  onSelected: (val: string) => void
  val?: string
  errorMessage?: string
}

const FormStockSearch = forwardRef<HTMLInputElement, Props>(function FormStockSearch(props: Props, ref) {
  const { onSelected, val, errorMessage } = props

  const handleSelect = (item: DropdownItem) => {
    onSelected(item.value)
  }

  return <StaticStockSearch onSymbolSelected={handleSelect} errorMessage={errorMessage} />
})

export default FormStockSearch
