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
import { useState } from 'react'
import SavedSearchDisplay from '../saved-searches/SavedSearchDisplay'

const AdvancedSearchDisplay = () => {
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
  const [selectedTab, setSelectedTab] = useState(0)
  const controller = useAdvancedSearchUi(filter)
  const { executeSearch, model } = controller
  const handleSetTab = (tab: TabInfo) => {
    setSelectedTab(tabs.findIndex((m) => m.title === tab.title))
  }
  const scroller = useScrollTop(0)
  const handlePageChange = () => {
    scroller.scroll()
  }
  const filterSummary = summarizeFilter(model.filter)
  const handleSubmit = async (filter: StockAdvancedSearchFilter) => {
    await executeSearch(filter)
    scroller.scroll()
  }

  const tabs: TabInfo[] = [
    {
      title: 'search',
    },
  ]
  if (model.allowSave) {
    tabs.push({ title: 'saved searches' })
  }

  return (
    <Box>
      <TabList tabs={tabs} selectedTab={selectedTab} onSetTab={handleSetTab} />
      {selectedTab === 0 && (
        <>
          <AdvancedSearchFilterForm onSubmitted={handleSubmit} controller={controller} filter={model.filter} />
          {model.showResults && (
            <>
              <ScrollTop scroller={scroller} marginTop={-12} />
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <Box>
                  <Typography textAlign={'center'} py={2}>
                    {filterSummary.summary}
                  </Typography>
                </Box>
              </Box>
              <PagedStockTable
                data={model.results}
                pageSize={5}
                onPageChanged={handlePageChange}
                showMovingAvgOnly={hasMovingAvgFilter(model.filter.movingAvg)}
                scrollOnPageChange
              />
            </>
          )}
        </>
      )}
      {selectedTab === 1 && <SavedSearchDisplay />}
    </Box>
  )
}

export default AdvancedSearchDisplay
