import { Box, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EditPortfolioForm, { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'
import { useUserController } from 'hooks/userController'
import { StockPortfolio } from 'lib/backend/api/aws/apiGateway'
import { constructDymamoPrimaryKey } from 'lib/backend/api/aws/util'
import { deleteRecord, putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import { findTextBetweenBrackets } from 'lib/util/string.util'
import React from 'react'
import useSWR, { mutate } from 'swr'
import StockPortfolioListItem from './StockPortfolioListItem'

const StockPortfolioLayout = () => {
  const { ticket } = useUserController()
  const username = ticket?.email
  const [showAddPortfolio, setShowAddPortfolio] = React.useState(false)
  const portfolioId = constructDymamoPrimaryKey('stockportfolio', username ?? '', crypto.randomUUID())
  const portfolioSecKey = constructDymamoPrimaryKey('stockportfolio', username!)
  const matches = findTextBetweenBrackets(portfolioId)
  const portfoliosMutateKey = ['/api/baseRoute', portfolioSecKey]
  const [editedPortfolio, setEditedPortfolio] = React.useState<StockPortfolio | null>(null)
  const [deletedPortfolio, setDeletedPortfolio] = React.useState<StockPortfolio | null>(null)

  const fetcherFn = async (url: string, key: string) => {
    const response = sortArray(await searchRecords(portfolioSecKey), ['last_modified'], ['desc'])
    const result = response.map((m) => JSON.parse(m.data) as StockPortfolio)
    //console.log(result)
    return result
  }

  const { data, isLoading, isValidating } = useSWR(portfoliosMutateKey, ([url, key]) => fetcherFn(url, key))

  //console.log('found: ', `${matches[0]}`)
  const handleAddPortfolioClick = () => {
    setShowAddPortfolio(true)
  }
  const handleAddPortfolio = async (data: PorfolioFields) => {
    setShowAddPortfolio(false)

    const item: StockPortfolio = {
      id: constructDymamoPrimaryKey('stockportfolio', username!, crypto.randomUUID()),
      name: data.name,
      positions: [],
    }
    const cat = constructDymamoPrimaryKey('stockportfolio', username!)
    //console.log(cat)
    await putRecord(item.id, cat, item)
    mutate(portfoliosMutateKey)
  }
  const handleSavePortfolio = async (data: PorfolioFields) => {
    if (editedPortfolio) {
      const item = { ...editedPortfolio, name: data.name }
      setEditedPortfolio(null)
      const cat = constructDymamoPrimaryKey('stockportfolio', username!)
      await putRecord(item.id, cat, item)
      mutate(portfoliosMutateKey)
    }

    setEditedPortfolio(null)
  }
  const handlePortfoliClick = (item: StockPortfolio) => {}
  const handleEditPortfolio = (item: StockPortfolio) => {
    setEditedPortfolio(item)
  }
  const handlePortfolioDelete = (item: StockPortfolio) => {
    setDeletedPortfolio(item)
  }
  const handleCancelAddPortfolio = () => {
    setShowAddPortfolio(false)
  }
  const handleCancelEditPortfolio = () => {
    setEditedPortfolio(null)
  }
  const handleDeletePortfolio = async () => {
    if (deletedPortfolio) {
      const item = { ...deletedPortfolio }
      setDeletedPortfolio(null)
      await deleteRecord(item.id)
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
                {data.length === 0 && (
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
                        portfolio={item}
                        editPortfolio={editedPortfolio}
                        handleSavePortfolio={handleSavePortfolio}
                        handlePortfolioClick={handlePortfoliClick}
                        handleCancelEditPortfolio={handleCancelEditPortfolio}
                        handleEditPortfolio={handleEditPortfolio}
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
