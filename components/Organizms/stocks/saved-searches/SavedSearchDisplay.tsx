import { Box } from '@mui/material'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { deleteRecord, getSavedStockSearches } from 'lib/backend/csr/nextApiWrapper'
import { useSwrHelper } from 'hooks/useSwrHelper'
import SavedSearchTable from './SavedSearchTable'
import { mutate } from 'swr'
import { StockSavedSearch } from '../advanced-search/stocksAdvancedSearch'
import StockTableSkeleton from '../StockTableSkeleton'

const SavedSearchDisplay = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const mutateKey = `stock-saved-search[${userProfile?.username}]`
  const dataFn = async () => {
    if (!userProfile) {
      return []
    }
    return await getSavedStockSearches(userProfile)
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  const onRefresh = () => {
    mutate(mutateKey)
  }
  const handleDeleteItem = async (item: StockSavedSearch) => {
    await deleteRecord(`stock-saved-search[${userProfile?.username}][${item.id}]`)
    mutate(mutateKey)
  }
  const isWaiting = isValidatingProfile || isLoading

  return (
    <Box>
      {isWaiting && (
        <>
          <CircleLoader />
        </>
      )}
      {userProfile ? (
        <Box>
          {data ? (
            <Box>
              <SavedSearchTable data={data} onRefresh={onRefresh} onDeleteItem={handleDeleteItem} />
            </Box>
          ) : (
            <StockTableSkeleton />
          )}
        </Box>
      ) : (
        <PleaseLogin />
      )}
    </Box>
  )
}

export default SavedSearchDisplay
