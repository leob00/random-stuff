import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'

const TabList = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event.currentTarget.nodeValue)
    setValue(newValue)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label='Item One' />
          <Tab label='Item Two' />
          <Tab label='Item Three' />
        </Tabs>
      </Box>
    </Box>
  )
}

export default TabList
