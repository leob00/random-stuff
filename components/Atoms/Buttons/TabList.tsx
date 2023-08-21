import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import NavigationButton from './NavigationButton'
import NLink from 'next/link'

const TabList = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event.currentTarget.nodeValue)
    setValue(newValue)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box
      // sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' sx={{ backgroundColor: 'transparent' }}>
          <Tab label='Page router' sx={{ backgroundColor: 'black', color: 'white' }} />
          <Tab label='Item Two' sx={{ backgroundColor: 'black', color: 'white' }} />
          <Tab label='Item Three' sx={{ backgroundColor: 'black', color: 'white' }} />
        </Tabs>
      </Box>
      <Box p={2}>
        {value === 0 && (
          <Box>
            <NLink href='/status'>status</NLink>
          </Box>
        )}
        {value === 1 && <Box>tab 2</Box>}
        {value === 2 && <Box>tab 3</Box>}
      </Box>
    </Box>
  )
}

export default TabList
