import { Box, Paper, Stack, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { Job, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import JobInProgress from './JobInProgress'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { DropdownItem, mapDropdownItems } from 'lib/models/dropdown'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'

const JobList = ({ response, onJobSelected }: { response: QlnApiResponse; onJobSelected: (item: Job) => void }) => {
  const pageSize = 5
  let jobs = response.Body as Job[]
  jobs = sortArray(jobs, ['Status', 'NextRunDate'], ['asc', 'asc'])

  const { getPagedItems, setPage, pagerModel } = useClientPager(jobs, pageSize)
  const pagedItems = getPagedItems(jobs)
  const scroller = useScrollTop(0)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }
  const jobItems = mapDropdownItems(sortArray(jobs, ['Name'], ['asc']), 'Description', 'Name')

  const handleSelectJob = (item: DropdownItem) => {
    const job = jobs.find((m) => m.Name === item.value)!
    onJobSelected(job)
  }

  return (
    <>
      <Box>
        <StaticAutoComplete options={jobItems} onSelected={handleSelectJob} disableClearable />
      </Box>
      <ScrollableBox scroller={scroller}>
        {pagedItems.map((item) => (
          <Box key={item.Name} py={1}>
            <Paper elevation={item.Status == 1 ? 4 : 0}>
              <ListHeader text={item.Description} item={item} onClicked={onJobSelected} />
              {item.Status === 1 ? (
                <JobInProgress item={item} />
              ) : (
                <Box minHeight={50} pt={1} pl={2} pb={1}>
                  <Box>
                    {item.EndRunDate && (
                      <Stack px={1}>
                        <Typography variant='caption' color='primary'>{`last run: ${dayjs().to(dayjs(item.EndRunDate))}`}</Typography>
                      </Stack>
                    )}
                    {item.NextRunDate && (
                      <Stack px={1}>
                        <Typography variant='caption' color='primary'>{`next run: ${dayjs().to(dayjs(item.NextRunDate))}`}</Typography>
                      </Stack>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        ))}
      </ScrollableBox>
      <Pager
        pageCount={pagerModel.totalNumberOfPages}
        itemCount={pagedItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pagerModel.page}
        totalItemCount={pagerModel.totalNumberOfItems}
        showHorizontalDivider={false}
      />
    </>
  )
}

export default JobList
