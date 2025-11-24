import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import StockListItem from './StockListItem'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const StockDetailsLayout = ({ symbol, disableCollapse = false }: { symbol: string; disableCollapse?: boolean }) => {
  const mutateKey = `stock-details-${symbol}`
  const dataFn = async () => {
    const result = await getStockQuotes([symbol])
    return result
  }
  const { userProfile, isValidating } = useProfileValidator()
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <>
      {isLoading && <ComponentLoader />}
      {!isValidating && (
        <>
          {data && data.length > 0 && (
            <StockListItem marketCategory='stocks' item={data[0]} expand scrollIntoView disabled={disableCollapse} userProfile={userProfile} />
          )}
        </>
      )}
    </>
  )
}

export default StockDetailsLayout
