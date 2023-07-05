import { Box, ListItemIcon, ListItemText, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getFutures } from 'lib/backend/api/qln/qlnApi'
import React, { Suspense } from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import StockTable from './StockTable'
import CachedIcon from '@mui/icons-material/Cached'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const FuturesLayout = () => {
  const [data, setData] = React.useState<StockQuote[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const result = await getFutures()
    setData(result)
    setIsLoading(false)
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData()
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = () => {
    loadData()
  }

  return (
    <Box py={2}>
      <Suspense
        fallback={
          <>
            <BackdropLoader />
            <LargeGridSkeleton />
          </>
        }
      >
        <>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <HamburgerMenu>
              <MenuList>
                <MenuItem onClick={handleRefresh}>
                  <ListItemIcon>
                    <CachedIcon color='secondary' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary='refresh'></ListItemText>
                </MenuItem>
              </MenuList>
            </HamburgerMenu>
          </Box>
          <Box pt={2}>{!isLoading && <StockTable stockList={data} isStock={false} />}</Box>
        </>
      </Suspense>
    </Box>
  )
}

export default FuturesLayout
