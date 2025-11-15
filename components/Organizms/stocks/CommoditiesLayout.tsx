import { Box } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import StockTable from './StockTable'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { useSwrHelper } from 'hooks/useSwrHelper'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import router from 'next/router'
import ContextMenuMyStocks from 'components/Molecules/Menus/ContextMenuMyStocks'
import ContextMenuCrypto from 'components/Molecules/Menus/ContextMenuCrypto'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import ContextMenuAllStocks from 'components/Molecules/Menus/ContextMenuAllStocks'

const CommoditiesLayout = () => {
  const endPoint = `/Futures`
  const dataFn = async () => {
    const resp = await serverGetFetch(endPoint)
    const quotes = resp.Body as StockQuote[]
    return quotes
  }

  const { data, isLoading } = useSwrHelper(endPoint, dataFn, { revalidateOnFocus: false })

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuAllStocks text={'stocks'} />,
      fn: () => router.push('/csr/community-stocks'),
    },
    {
      item: <ContextMenuMyStocks />,
      fn: () => router.push('/csr/my-stocks'),
    },
    {
      item: <ContextMenuCrypto text={'crypto'} />,
      fn: () => router.push('/csr/crypto'),
    },
  ]
  const { userProfile, isValidating } = useProfileValidator()
  return (
    <>
      {!isValidating && (
        <Box py={2}>
          {isLoading && <BackdropLoader />}
          {data && (
            <Box pt={2}>
              <ScrollIntoView enabled />
              <Box display={'flex'} justifyContent={'flex-end'}>
                <ContextMenu items={menu} />
              </Box>
              <StockTable stockList={data} marketCategory='commodities' showSummary userProfile={userProfile} />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default CommoditiesLayout
