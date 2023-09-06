import { Box, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import HamburgerMenu from 'components/Molecules/Menus/HamburgerMenu'
import { useUserController } from 'hooks/userController'
import { constructDymamoPrimaryKey } from 'lib/backend/api/aws/util'
import React from 'react'

const StockPortfolioLayout = () => {
  const { ticket } = useUserController()
  const username = ticket?.email
  if (!username) {
    return <></>
  }
  const [showAddPortfolio, setShowAddPortfolio] = React.useState(false)

  const portfolioId = constructDymamoPrimaryKey('stockportfolio', username, crypto.randomUUID())

  const regEx = new RegExp(/(?<=\[).+?(?=\])/g)
  const matches = Array.from(portfolioId.matchAll(regEx))

  //console.log('found: ', `${matches[0]}`)
  const handleAddPortfolioClick = () => {
    setShowAddPortfolio(true)
  }
  return (
    <>
      <Box py={2}>
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
        {showAddPortfolio && (
          <Box>
            <CenterStack>new portfolio</CenterStack>
          </Box>
        )}
      </Box>
    </>
  )
}

export default StockPortfolioLayout
