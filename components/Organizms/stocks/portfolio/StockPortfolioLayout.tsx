import { Box, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EditPortfolioForm, { PorfoliFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'
import { useUserController } from 'hooks/userController'
import { constructDymamoPrimaryKey } from 'lib/backend/api/aws/util'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { findTextBetweenBrackets } from 'lib/util/string.util'
import React from 'react'
import useSWR, { mutate } from 'swr'

const StockPortfolioLayout = () => {
  const { ticket } = useUserController()
  const username = ticket?.email
  const [showAddPortfolio, setShowAddPortfolio] = React.useState(false)
  const portfolioId = constructDymamoPrimaryKey('stockportfolio', username ?? '', crypto.randomUUID())
  const portfolioSecKey = constructDymamoPrimaryKey('stockportfolio', username!)
  const matches = findTextBetweenBrackets(portfolioId)
  const portfoliosMutateKey = ['/api/baseRoute', portfolioSecKey]

  const fetcherFn = async (url: string, key: string) => {
    const response = await searchRecords(portfolioSecKey)
    console.log(response)
    return response
  }

  const { data, isLoading, isValidating } = useSWR(portfoliosMutateKey, ([url, key]) => fetcherFn(url, key))

  //console.log('found: ', `${matches[0]}`)
  const handleAddPortfolioClick = () => {
    setShowAddPortfolio(true)
  }
  const handleEditPortFolio = (data: PorfoliFields) => {
    console.log(data)
    setShowAddPortfolio(false)
  }
  return (
    <>
      <Box py={2}>
        {isLoading && <BackdropLoader />}
        {isValidating && <BackdropLoader />}
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Box></Box>
          <Box>
            <HamburgerMenu>
              <MenuList>
                <MenuItem onClick={handleAddPortfolioClick}>
                  <ListItemText primary='create a new portfolio'></ListItemText>
                </MenuItem>
                <HorizontalDivider />
              </MenuList>
            </HamburgerMenu>
          </Box>
        </Box>

        {showAddPortfolio ? (
          <Box>
            <EditPortfolioForm title='New Stock Portfolio' obj={{ name: '' }} onSubmitted={handleEditPortFolio} />
          </Box>
        ) : (
          <>
            {/* {data && (
              <Box>
                {data.length === 0 && (
                  <Box py={4}>
                    <CenterStack>
                      <PrimaryButton text={'create a new portfolio'} onClick={() => setShowAddPortfolio(true)} />
                    </CenterStack>
                  </Box>
                )}
              </Box>
            )} */}
          </>
        )}
      </Box>
    </>
  )
}

export default StockPortfolioLayout
