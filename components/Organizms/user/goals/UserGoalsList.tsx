import { Box, useTheme } from '@mui/material'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import Pager from 'components/Atoms/Pager'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useClientPager } from 'hooks/useClientPager'
import GoalStats from './GoalStats'
import { UserGoal } from './goalModels'

const UserGoalsList = ({ data, onShowEdit }: { data: UserGoal[]; onShowEdit: (item: UserGoal) => void }) => {
  const pageSize = 5
  const scroller = useScrollTop(0)

  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const pagedItems = getPagedItems(data)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  return (
    <>
      <Box minHeight={380}>
        <ScrollableBox scroller={scroller}>
          {pagedItems.map((item, i) => (
            <Box key={item.id}>
              <Box>
                <ListHeader text={item.body ?? ''} item={item} onClicked={onShowEdit} />
                {item.stats && (
                  <Box py={1}>
                    <GoalStats goal={item} completePercent={item.deleteCompletedTasks ? undefined : (item.completePercent ?? 0)} />
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
