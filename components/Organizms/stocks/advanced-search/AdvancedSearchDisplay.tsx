import { Box } from '@mui/material'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import TabList from 'components/Atoms/Buttons/TabList'
import AdvancedSearchFilterForm from './AdvancedSearchFilterForm'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'
import useAdvancedSearchUi from './stockAdvancedSearchUi'

const AdvancedSearchDisplay = () => {
  const tabs: TabInfo[] = [
    {
      title: 'search',
    },
  ]
  const controller = useAdvancedSearchUi()
  const handleSetTab = (tab: TabInfo) => {}
  const handleSubmit = async (filter: StockAdvancedSearchFilter) => {
    await controller.executeSearch(filter)
  }
  return (
    <Box>
      <TabList tabs={tabs} selectedTab={0} onSetTab={handleSetTab} />
      <AdvancedSearchFilterForm onSubmitted={handleSubmit} controller={controller} />
    </Box>
  )
}

export default AdvancedSearchDisplay
