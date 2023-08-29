import { Box, Tab, Tabs, useTheme } from '@mui/material'
import { DarkModeBlue, VeryLightBlue } from 'components/themes/mainTheme'
import React from 'react'
import { TabInfo } from './TabButtonList'

const TabList = ({ tabs, onSetTab }: { tabs: TabInfo[]; onSetTab: (tab: TabInfo) => void }) => {
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = React.useState(tabs.findIndex((m) => m.selected))
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
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
