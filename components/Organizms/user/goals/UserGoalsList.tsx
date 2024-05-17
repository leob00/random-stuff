import { Box, Typography, useTheme } from '@mui/material'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import Clickable from 'components/Atoms/Containers/Clickable'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import Pager from 'components/Atoms/Pager'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { CasinoRedTransparent, RedDarkMode } from 'components/themes/mainTheme'
import { useClientPager } from 'hooks/useClientPager'
import { UserGoal } from 'lib/models/userTasks'
import React from 'react'

const UserGoalsList = ({ data, onShowEdit }: { data: UserGoal[]; onShowEdit: (item: UserGoal) => void }) => {
  const pageSize = 5
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  const scroller = useScrollTop(0)

  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const pagedItems = getPagedItems(data)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  return (
    <>
      <Box minHeight={240}>
        <ScrollableBox scroller={scroller}>
          {pagedItems.map((item, i) => (
            <Box key={item.id}>
              <Box>
                <ListHeader text={item.body ?? ''} item={item} onClicked={onShowEdit} />
                {/* <Clickable
                  onClicked={() => {
                    onShowEdit(item)
                  }}>
                  <Typography variant='h6'>{item.body ?? ''}</Typography>
                </Clickable> */}
                {item.stats && (
                  <Box pl={2} pb={2}>
                    <Box>
                      <ReadOnlyField label={`tasks`} val={`${Number(item.stats.completed) + Number(item.stats.inProgress)}`} />
                      <ReadOnlyField label={`completed`} val={`${item.stats.completed}`} />
                      <ReadOnlyField label={`in progress`} val={`${item.stats.inProgress}`} />
                    </Box>
                    {item.stats.pastDue > 0 && <Typography variant='body2' pt={1} color={redColor}>{`past due: ${item.stats.pastDue}`}</Typography>}
                  </Box>
                )}
              </Box>
              {i < pagedItems.length - 1 && <HorizontalDivider />}
            </Box>
          ))}
        </ScrollableBox>
      </Box>
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

export default UserGoalsList
