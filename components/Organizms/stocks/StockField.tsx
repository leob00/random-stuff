import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'

interface Model {
  label: string
  val: string
}
const StockField = ({ quote, field }: { quote: StockQuote; field: keyof StockQuote }) => {
  const item: Model = {
    label: '',
    val: '',
  }

  switch (field) {
    case 'Volume':
      item.label = 'volume'
      item.val = numeral(quote.Volume).format('###,###')
      break
    case 'MarketCapShort':
      item.label = 'cap'
      item.val = quote.MarketCapShort ?? ''
  }

  return <ReadOnlyField label={item.label} val={item.val} />
}

export default StockField
