import Warning from '@mui/icons-material/Warning'
import { Box, Stack, Button, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import Clickable from 'components/Atoms/Containers/Clickable'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import Pager from 'components/Atoms/Pager'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import dayjs from 'dayjs'
import { useClientPager } from 'hooks/useClientPager'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { DropdownItem, mapDropdownItems } from 'lib/models/dropdown'
import { getExpirationText, getUtcNow } from 'lib/util/dateUtil'
import { useState } from 'react'

const NoteList = ({ data, onClicked, onAddNote }: { data: UserNote[]; onClicked: (item: UserNote) => void; onAddNote: () => void }) => {
  const scroller = useScrollTop(0)
  const [searchText, setSearchText] = useState('')
  const pageSize = 10
  const notesSearch = mapDropdownItems(data, 'title', 'id')

  const filterResults = () => {
    if (searchText.length > 0) {
      return data.filter((m) => m.title.toLowerCase().includes(searchText.toLowerCase()))
    }
    return [...data]
  }

  const filtered = filterResults()
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(filtered, pageSize)
  const handleNoteTitleClick = (item: UserNote) => {
    onClicked(item)
  }

  const handleSearched = (text: string) => {
    setSearchText(text)
  }
  const handleSearchSelected = (item: DropdownItem) => {
    const note = data.find((m) => m.id === item.value)!
    onClicked(note)
  }

  const pagedItems = getPagedItems(filtered)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box>
        <Box display={'flex'} justifyContent={'flex-start'}>
          <Box pb={2}>
            <PrimaryButton text='add note' size='small' onClick={onAddNote} />
          </Box>
        </Box>
        <Box sx={{ pb: 2 }} display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
          {/* <SearchWithinList text={`search ${numeral(data.length).format('###,###')} notes`} onChanged={handleSearched} /> */}
          <Box flexGrow={1}>
            <StaticAutoComplete placeholder={`search in ${notesSearch.length} notes`} options={notesSearch} onSelected={handleSearchSelected} fullWidth />
          </Box>
        </Box>
        <HorizontalDivider />
      </Box>

      <ScrollableBox scroller={scroller}>
        <Box>
          {pagedItems.map((item, i) => (
            <Box key={item.id}>
              <FadeIn>
                <Box>
                  <Stack direction='row' py={2}>
                    <Box pt={1}>
                      <Clickable
                        onClicked={() => {
                          handleNoteTitleClick(item)
                        }}
                      >
                        <Typography variant='body1'>{item.title}</Typography>
                      </Clickable>
                    </Box>
                  </Stack>
                </Box>
                {item.expirationDate && dayjs(item.expirationDate).diff(getUtcNow(), 'day') < 2 && (
                  <Box display={'flex'} justifyContent={'flex-end'} gap={1} alignItems={'center'}>
                    <DefaultTooltip text={getExpirationText(item.expirationDate)}>
                      <Warning fontSize='small' color='warning' />
                    </DefaultTooltip>
                    <Typography variant='caption'>{'expires soon'}</Typography>
                  </Box>
                )}
              </FadeIn>
              {i < pagedItems.length - 1 && <HorizontalDivider />}
            </Box>
          ))}
        </Box>
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
    </Box>
  )
}

export default NoteList
