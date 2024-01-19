import { Box } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import React from 'react'
import { StockGroup } from './GroupedStocksLayout'
import GroupedStockItem from './GroupedStockItem'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

const GroupedStockTable = ({ result, userProfile }: { result: StockGroup[]; userProfile?: UserProfile | null }) => {
  return (
    <Box minHeight={650}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {result.map((item, index) => (
          <Box key={item.groupName}>
            <GroupedStockItem group={item} userProfile={userProfile} />
          </Box>
        ))}
        <>
          {result.length === 0 && (
            <Box>
              <NoDataFound message='We were unable to find any results that match your search critera.' />
            </Box>
          )}
        </>
      </Box>
    </Box>
  )
}

export default GroupedStockTable
