import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'
import { mapStockField } from './advanced-search/results/StockFields'

const StockField = ({ quote, field }: { quote: StockQuote; field: keyof StockQuote }) => {
  const item = mapStockField(field, quote)
  return <ReadOnlyField label={item.label} val={item.val} />
}

export default StockField
