'use client'
import { Box, Tab, Tabs, useTheme } from '@mui/material'
import { TabInfo } from './TabButtonList'

const TabList = ({ tabs, selectedTab, onSetTab }: { tabs: TabInfo[]; selectedTab: number; onSetTab: (tab: TabInfo) => void }) => {
  const theme = useTheme()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onSetTab(tabs[newValue])
  }

  return (
    <Box pb={2}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons='auto'
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
          '& .MuiTab-root': {
            color: theme.palette.secondary.main,
          },
          '& .Mui-selected': {
            // Styles for the selected tab
            color: theme.palette.primary.main, // Change this to your desired color
            fontWeight: 'bold',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab label={tab.title} key={index} color='red' />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabList
