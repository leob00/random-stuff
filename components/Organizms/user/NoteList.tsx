import { Box, Button, Stack, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import Pager from 'components/Atoms/Pager'
import dayjs from 'dayjs'
import { useClientPager } from 'hooks/useClientPager'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { DropdownItem, mapDropdownItems } from 'lib/models/dropdown'
import { getUtcNow } from 'lib/util/dateUtil'
import { useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { sortArray } from 'lib/util/collections'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import RecordExpirationWarning from 'components/Atoms/Text/RecordExpirationWarning'

const NoteList = ({ data, onClicked, onAddNote }: { data: UserNote[]; onClicked: (item: UserNote) => void; onAddNote: () => void }) => {
  const scroller = useScrollTop(0)
  const [searchText, setSearchText] = useState('')
  const pageSize = 10
  const notesSearch = sortArray(mapDropdownItems(data, 'title', 'id'), ['text'], ['asc'])

  const filterResults = () => {
    if (searchText.length > 0) {
      return data.filter((m) => m.title.toLowerCase().includes(searchText.toLowerCase()))
    }
    return [...data]
  }

  const filtered = filterResults()
  const { pagerModel, setPage, getPagedItems } = useClientPager(filtered, pageSize)
  const handleNoteTitleClick = (item: UserNote) => {
    onClicked(item)
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
            <SuccessButton text='Create...' size='small' onClick={onAddNote} />
          </Box>
        </Box>
        <Box sx={{ pb: 2 }} display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
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
                  <Stack py={1}>
                    <Button
                      fullWidth
                      onClick={() => {
                        handleNoteTitleClick(item)
                      }}
                    >
                      <Typography py={1} textAlign={'left'} width={'inherit'} variant='h5'>
                        {item.title}
                      </Typography>
                    </Button>
                    {item.files && item.files.length > 0 && (
                      <Box display={'flex'} gap={1} alignItems={'center'}>
                        <Box>
                          <Typography variant='body2' pt={1} pl={1}>
                            <AttachFileIcon fontSize='inherit' />
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant='caption'>{`files: ${item.files.length}`}</Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </Box>
                {item.expirationDate && (
                  <Box display={'flex'} justifyContent={'flex-end'} gap={1} alignItems={'center'}>
                    <RecordExpirationWarning expirationDate={item.expirationDate} />
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
