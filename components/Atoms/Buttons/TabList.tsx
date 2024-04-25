import { Box, Tab, Tabs, useTheme } from '@mui/material'

import React from 'react'

import { TabInfo } from './TabButtonList'

const TabList = ({ tabs, selectedTab, onSetTab }: { tabs: TabInfo[]; selectedTab: number; onSetTab: (tab: TabInfo) => void }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onSetTab(tabs[newValue])
  }

  return (
    <Box sx={{ width: '100%' }} pb={2}>
      <Box>
        <Tabs value={selectedTab} onChange={handleChange}>
          {tabs.map((tab, index) => (
            <Tab label={tab.title} key={index} />
          ))}
        </Tabs>
      </Box>
    </Box>
  )
}

export default TabList
