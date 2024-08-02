import StockSearch from 'components/Atoms/Inputs/StockSearch'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { forwardRef } from 'react'

type Props = {
  onSelected: (val: string) => void
  val?: string
  errorMessage?: string
}

const FormStockSearch = forwardRef<HTMLInputElement, Props>(function FormStockSearch(props: Props, ref) {
  const { onSelected, val, errorMessage } = props

  const handleSelect = (item: StockQuote) => {
    onSelected(item.Symbol)
  }

  return <StockSearch onSymbolSelected={handleSelect} clearOnSelect={false} value={val} errorMessage={errorMessage} />
})

export default FormStockSearch
