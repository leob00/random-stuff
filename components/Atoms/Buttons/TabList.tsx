import { Box, Tab, Tabs, useTheme } from '@mui/material'
import React from 'react'
import { TabInfo } from './TabButtonList'

const TabList = ({ tabs, selectedTab, onSetTab }: { tabs: TabInfo[]; selectedTab: number; onSetTab: (tab: TabInfo) => void }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onSetTab(tabs[newValue])
  }

  return (
    <Box pb={2}>
      <Tabs value={selectedTab} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
        {tabs.map((tab, index) => (
          <Tab label={tab.title} key={index} />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabList
