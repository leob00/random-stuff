import { Box } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { StockGroup } from './GroupedStocksLayout'
import GroupedStockItem from './GroupedStockItem'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

const GroupedStockTable = ({ result, userProfile }: { result: StockGroup[]; userProfile: UserProfile | null }) => {
  const pageSize = 10
  const pager = useClientPager(result, 10)
  const displayItems = pager.getPagedItems(result)
  const handlePaged = (pageNum: number) => {
    pager.setPage(pageNum)
  }
  return (
    <Box minHeight={650}>
      <Box display={'flex'} flexDirection={'column'} gap={1}>
        {displayItems.map((item) => (
          <GroupedStockItem key={item.groupName} stockGroup={item} userProfile={userProfile} />
        ))}
        <>
          {displayItems.length === 0 && (
            <Box>
              <NoDataFound message='We were unable to find any results that match your search critera.' />
            </Box>
          )}
        </>
      </Box>
      <Pager
        pageCount={pager.pagerModel.totalNumberOfPages}
        itemCount={displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pager.pagerModel.page}
        totalItemCount={pager.pagerModel.totalNumberOfItems}
      ></Pager>
    </Box>
  )
}

export default GroupedStockTable
