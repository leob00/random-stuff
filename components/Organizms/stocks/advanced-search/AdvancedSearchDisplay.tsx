import { Box } from '@mui/material'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import TabList from 'components/Atoms/Buttons/TabList'
import AdvancedSearchFilterForm from './AdvancedSearchFilterForm'
import { StockMovingAvgFilter } from '../reports/stockMovingAvgFilter'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'

const AdvancedSearchDisplay = () => {
  const tabs: TabInfo[] = [
    {
      title: 'search',
    },
  ]
  const handleSetTab = (tab: TabInfo) => {}
  const handleSubmit = (filter: StockAdvancedSearchFilter) => {
    console.log(filter)
  }
  return (
    <Box>
      <TabList tabs={tabs} selectedTab={0} onSetTab={handleSetTab} />
      <AdvancedSearchFilterForm onSubmitted={handleSubmit} />
    </Box>
  )
}

export default AdvancedSearchDisplay
