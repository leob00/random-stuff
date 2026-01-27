'use client'
import { Box, Typography } from '@mui/material'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import TabList from 'components/Atoms/Buttons/TabList'
import AdvancedSearchFilterForm from './AdvancedSearchFilterForm'
import { StockAdvancedSearchFilter } from './advancedSearchFilter'
import useAdvancedSearchUi from './stockAdvancedSearchUi'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { summarizeFilter } from './stocksAdvancedSearch'
import { useState } from 'react'
import SavedSearchDisplay from '../saved-searches/SavedSearchDisplay'
import SearchResultsTable from './results/SearchResultsTable'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'

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
    annualYield: {},
  }
  const [selectedTab, setSelectedTab] = useState(0)
  const controller = useAdvancedSearchUi(filter)
  const { executeSearch, model } = controller
  const handleSetTab = (tab: TabInfo) => {
    setSelectedTab(tabs.findIndex((m) => m.title === tab.title))
  }
  const scroller = useScrollTop(0)
  const handlePageChange = () => {
    //scroller.scroll()
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
            <Box>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <Box>
                  <Typography textAlign={'center'} py={2}>
                    {filterSummary.summary}
                  </Typography>
                </Box>
              </Box>
              {/* <ScrollTop scroller={scroller} marginTop={-100} /> */}
              <SearchResultsTable data={model.results} onPageChanged={handlePageChange} filterSummary={filterSummary} />
            </Box>
          )}
        </>
      )}
      {selectedTab === 1 && <SavedSearchDisplay />}
    </Box>
  )
}

export default AdvancedSearchDisplay
