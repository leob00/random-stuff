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
import GoalStats from './GoalStats'
import GoalProgressBar from './GoalProgressBar'

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
                {item.stats && (
                  <Box pl={2} py={1}>
                    <GoalStats stats={item.stats} completePercent={item.deleteCompletedTasks ? undefined : item.completePercent ?? 0} />
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
