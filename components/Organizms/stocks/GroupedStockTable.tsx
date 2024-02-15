import { Box } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import React from 'react'
import { StockGroup } from './GroupedStocksLayout'
import GroupedStockItem from './GroupedStockItem'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { usePager } from 'hooks/usePager'
import Pager from 'components/Atoms/Pager'

const GroupedStockTable = ({ result, userProfile }: { result: StockGroup[]; userProfile?: UserProfile | null }) => {
  const pageSize = 10
  const { page, setPage, displayItems, pageCount } = usePager(result, pageSize)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }
  return (
    <Box minHeight={650}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {displayItems.map((item, index) => (
          <Box key={item.groupName}>
            <GroupedStockItem group={item} userProfile={userProfile} />
          </Box>
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
        pageCount={pageCount}
        itemCount={displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={page}
        totalItemCount={result.length}
      ></Pager>
    </Box>
  )
}

export default GroupedStockTable
