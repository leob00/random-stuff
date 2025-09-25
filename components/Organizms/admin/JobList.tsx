import { Box, Stack, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { Job, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import React, { Dispatch, SetStateAction } from 'react'
import JobInProgress from './JobInProgress'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { DropdownItem, mapDropdownItems } from 'lib/models/dropdown'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import JobDetail from './users/admin/jobs/JobDetail'

const JobList = ({
  response,
  onJobSelected,
  selectedItem,
  setSelectedItem,
}: {
  response: QlnApiResponse
  onJobSelected: (item: Job | null) => void
  selectedItem: Job | null
  setSelectedItem: Dispatch<SetStateAction<Job | null>>
}) => {
  let jobs = response.Body as Job[]
  jobs = sortArray(jobs, ['Status', 'NextRunDate'], ['asc', 'asc'])

  const pageSize = 5
  const { getPagedItems, setPage, pagerModel } = useClientPager(jobs, pageSize)
  const pagedItems = getPagedItems(jobs)
  const scroller = useScrollTop(0)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }
  const jobItems = mapDropdownItems(sortArray(jobs, ['Name'], ['asc']), 'Description', 'Name')

  const handleSelectJob = (item: DropdownItem) => {
    const job = jobs.find((m) => m.Name === item.value)
    if (job) {
      onJobSelected(job)
    }
  }

  const handleJobClick = (job: Job) => {
    if (job.Name === selectedItem?.Name) {
      setSelectedItem(null)
      onJobSelected(null)
      return
    }
    onJobSelected(job)
  }
  return (
    <>
      <Stack sx={{ pt: 2 }}>
        <StaticAutoComplete options={jobItems} onSelected={handleSelectJob} fullWidth />
      </Stack>
      <ScrollableBox scroller={scroller}>
        {pagedItems.map((item) => (
          <Box key={item.Name} py={1}>
            <Box>
              <ListHeader
                text={item.Description}
                item={item}
                onClicked={() => {
                  handleJobClick(item)
                }}
                fadeIn={false}
                selected={selectedItem !== null && selectedItem.Name === item.Name}
              />
              <>
                {item.Status === 1 && <JobInProgress item={item} />}
                <Box pt={1} pl={2} pb={1}>
                  <Box>
                    {item.EndRunDate && (
                      <Stack px={1}>
                        <Typography variant='caption' color='primary'>{`last run: ${dayjs(response.ResponseDateEst).to(dayjs(item.EndRunDate))}`}</Typography>
                      </Stack>
                    )}
                    {item.NextRunDate && (
                      <Stack px={1}>
                        <Typography variant='caption' color='primary'>{`next run: ${dayjs(response.ResponseDateEst).to(dayjs(item.NextRunDate))}`}</Typography>
                      </Stack>
                    )}
                    {selectedItem !== null && selectedItem.Name === item.Name && <JobDetail item={selectedItem} />}
                  </Box>
                </Box>
              </>
            </Box>
            <HorizontalDivider />
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
