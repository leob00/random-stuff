import { Box, ListItemText } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EditPortfolioForm, { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import { useUserController } from 'hooks/userController'
import { StockPortfolio, StockPosition } from 'lib/backend/api/aws/apiGateway'
import { constructDynamoKey, constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'
import { deleteRecord, putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'
import StockPortfolioListItem from './StockPortfolioListItem'

const StockPortfolioLayout = () => {
  const { ticket } = useUserController()
  const username = ticket?.email
  const [showAddPortfolio, setShowAddPortfolio] = React.useState(false)
  const portfolioSecKey = constructDynamoKey('stockportfolio', username!)
  const portfoliosMutateKey = ['/api/baseRoute', portfolioSecKey]
  const [deletedPortfolio, setDeletedPortfolio] = React.useState<StockPortfolio | null>(null)
  const [isMutating, setIsMutating] = React.useState(false)

  const fetcherFn = async (url: string, key: string) => {
    const response = sortArray(await searchRecords(portfolioSecKey), ['last_modified'], ['desc'])
    const result = response.map((m) => JSON.parse(m.data) as StockPortfolio)
    const sorted = sortArray(result, ['name'], ['asc'])
    return sorted
  }

  const { data, isLoading, isValidating } = useSWR(portfoliosMutateKey, ([url, key]) => fetcherFn(url, key))

  const handleAddPortfolio = async (data: PorfolioFields) => {
    const item: StockPortfolio = {
      id: constructDynamoKey('stockportfolio', username!, crypto.randomUUID()),
      name: data.name,
    }
    const cat = constructDynamoKey('stockportfolio', username!)
    await putRecord(item.id, cat, item)
    mutate(portfoliosMutateKey)
    setShowAddPortfolio(false)
  }

  const handlePortfolioDelete = (item: StockPortfolio) => {
    setDeletedPortfolio(item)
  }
  const handleCancelAddPortfolio = () => {
    setShowAddPortfolio(false)
  }

  const handleDeletePortfolio = async () => {
    setIsMutating(true)
    if (deletedPortfolio) {
      const item = { ...deletedPortfolio }
      setDeletedPortfolio(null)
      const username = getUsernameFromKey(item.id)
      const portfolioId = getPorfolioIdFromKey(item.id)
      const searchKey = constructStockPositionSecondaryKey(username, portfolioId)
      const records = (await searchRecords(searchKey)).map((m) => JSON.parse(m.data) as StockPosition)
      // TODO: refactor to batch delete records
      records.forEach((r) => {
        deleteRecord(r.id)
      })
      await deleteRecord(item.id)
      setIsMutating(false)
      mutate(portfoliosMutateKey)
    }
    setDeletedPortfolio(null)
  }
  const handlePortfoliosMutate = async () => {
    mutate(portfoliosMutateKey)
  }

  const portfoliosMenu: ContextMenuItem[] = [
    {
      item: (
        <>
          <ListItemText primary='create a new portfolio'></ListItemText>
        </>
      ),
      fn: () => setShowAddPortfolio(true),
    },
  ]

  return (
    <>
      <Box py={2}>
        {isMutating && <BackdropLoader />}
        {isLoading && <BackdropLoader />}
        {isValidating && <BackdropLoader />}
        {!showAddPortfolio && (
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Box></Box>
            <ContextMenu items={portfoliosMenu} />
          </Box>
        )}
        {showAddPortfolio ? (
          <Box>
            <EditPortfolioForm title='New Stock Portfolio' obj={{ name: '' }} onSubmitted={handleAddPortfolio} onCancel={handleCancelAddPortfolio} />
          </Box>
        ) : (
          <>
            {data && (
              <Box>
                {data.length === 0 && !isValidating && (
                  <Box py={4}>
                    <CenterStack>
                      <PrimaryButton text={'create a new portfolio'} onClick={() => setShowAddPortfolio(true)} />
                    </CenterStack>
                  </Box>
                )}
                <Box pt={1}>
                  {data.map((item) => (
                    <Box key={item.id}>
                      <StockPortfolioListItem
                        allPortfolios={data}
                        portfolio={item}
                        handlePortfolioDelete={handlePortfolioDelete}
                        onMutate={handlePortfoliosMutate}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
      <ConfirmDeleteDialog
        text='Are you sure you want to delete thsi portfolio and all of its positions?'
        show={deletedPortfolio !== null}
        onCancel={() => setDeletedPortfolio(null)}
        onConfirm={handleDeletePortfolio}
      />
    </>
  )
}

export default StockPortfolioLayout
