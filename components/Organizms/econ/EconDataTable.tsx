'use client'
import { Box } from '@mui/material'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import Pager from 'components/Atoms/Pager'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useClientPager } from 'hooks/useClientPager'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import EconLastPrevChange from '../widgets/econ/EconLastPrevChange'

const EconDataTable = ({ data, handleItemClicked }: { data: EconomicDataItem[]; handleItemClicked: (item: EconomicDataItem) => void }) => {
  const pageSize = 10
  const pager = useClientPager(data, 10)
  const displayItems = pager.getPagedItems(data)
  const scroller = useScrollTop(0)

  const handlePaged = (pageNum: number) => {
    scroller.scroll()
    pager.setPage(pageNum)
  }
  return (
    <>
      <ScrollableBox scroller={scroller}>
        <Box minHeight={60 * pageSize} pt={2}>
          {displayItems.map((item, i) => (
            <Box key={item.InternalId} py={1}>
              <ListHeader text={item.Title} item={item} onClicked={handleItemClicked} fadeIn={false} />
              <Box pl={1}>
                <EconLastPrevChange item={item} />
              </Box>
              <HorizontalDivider />
            </Box>
          ))}
        </Box>
      </ScrollableBox>
      {pager.pagerModel.totalNumberOfPages > 1 && (
        <Pager
          pageCount={pager.pagerModel.totalNumberOfPages}
          itemCount={displayItems.length}
          itemsPerPage={pageSize}
          onPaged={(pageNum: number) => handlePaged(pageNum)}
          defaultPageIndex={pager.pagerModel.page}
          totalItemCount={pager.pagerModel.totalNumberOfItems}
        ></Pager>
      )}
    </>
  )
}

export default EconDataTable
