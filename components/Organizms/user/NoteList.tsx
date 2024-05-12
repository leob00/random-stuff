import Warning from '@mui/icons-material/Warning'
import { Box, Stack, Button, Typography } from '@mui/material'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import Clickable from 'components/Atoms/Containers/Clickable'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import Pager from 'components/Atoms/Pager'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import dayjs from 'dayjs'
import { useClientPager } from 'hooks/useClientPager'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getExpirationText, getUtcNow } from 'lib/util/dateUtil'
import numeral from 'numeral'
import React from 'react'

const NoteList = ({ data, onClicked, onAddNote }: { data: UserNote[]; onClicked: (item: UserNote) => void; onAddNote: () => void }) => {
  const scroller = useScrollTop(0)
  const [searchText, setSearchText] = React.useState('')
  const pageSize = 10

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

  const pagedItems = getPagedItems(filtered)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box>
        <Box sx={{ pb: 2 }} display={'flex'} justifyContent={'space-between'}>
          <SearchWithinList text={`search ${numeral(data.length).format('###,###')} notes`} onChanged={handleSearched} />
          <PrimaryButton text='add note' size='small' onClick={onAddNote} />
        </Box>
        <HorizontalDivider />
      </Box>

      <ScrollableBox scroller={scroller} maxHeight={320}>
        <Box minHeight={324}>
          {/* <ScrollTop scroller={scroller} /> */}

          {pagedItems.map((item, i) => (
            <Box key={item.id}>
              <Box>
                <Stack direction='row' py={2}>
                  <Box pt={1}>
                    <Clickable
                      onClicked={() => {
                        handleNoteTitleClick(item)
                      }}
                    >
                      <Typography textAlign={'left'}>{item.title}</Typography>
                    </Clickable>
                  </Box>
                  <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
                    {item.expirationDate && dayjs(item.expirationDate).diff(getUtcNow(), 'day') < 2 && (
                      <Button size='small'>
                        <DefaultTooltip text={getExpirationText(item.expirationDate)}>
                          <Warning fontSize='small' color='warning' />
                        </DefaultTooltip>
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>

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
      ></Pager>
    </Box>
  )
}

export default NoteList
