import { Box, Typography } from '@mui/material'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import TabList from 'components/Atoms/Buttons/TabList'
import AdvancedSearchFilterForm from './AdvancedSearchFilterForm'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'
import useAdvancedSearchUi from './stockAdvancedSearchUi'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { hasMovingAvgFilter, summarizeFilter } from './stocksAdvancedSearch'
import PagedStockTable from '../PagedStockTable'

const AdvancedSearchDisplay = () => {
  const tabs: TabInfo[] = [
    {
      title: 'search',
    },
  ]
  const filter: StockAdvancedSearchFilter = {
    marketCap: {
      includeMegaCap: false,
      includeLargeCap: false,
      includeMidCap: false,
      includeSmallCap: false,
    },
    take: 100,
    movingAvg: {
      days: 0,
    },
    peRatio: {},
  }
  const controller = useAdvancedSearchUi(filter)
  const handleSetTab = (tab: TabInfo) => {}
  const scroller = useScrollTop(0)
  const handlePageChange = () => {
    scroller.scroll()
  }
  const filterSummary = summarizeFilter(controller.model.filter)
  const handleSubmit = async (filter: StockAdvancedSearchFilter) => {
    await controller.executeSearch(filter)
    scroller.scroll()
  }

  return (
    <Box>
      <TabList tabs={tabs} selectedTab={0} onSetTab={handleSetTab} />
      <AdvancedSearchFilterForm onSubmitted={handleSubmit} controller={controller} filter={filter} />
      {controller.model.showResults && (
        <>
          <ScrollTop scroller={scroller} marginTop={-12} />
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography textAlign={'center'} variant='h6' pt={2}>
              search results
            </Typography>
            <Typography textAlign={'center'} py={2}>
              {filterSummary}
            </Typography>
          </Box>

          <PagedStockTable
            data={controller.model.results}
            pageSize={5}
            onPageChanged={handlePageChange}
            showMovingAvgOnly={hasMovingAvgFilter(controller.model.filter.movingAvg)}
            scrollOnPageChange
          />
        </>
      )}
    </Box>
  )
}

export default AdvancedSearchDisplay
