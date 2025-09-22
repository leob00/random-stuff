import { Box } from '@mui/material'
import { StockSavedSearch, StockFilterSummary, summarizeFilter } from '../advanced-search/stocksAdvancedSearch'
import Clickable from 'components/Atoms/Containers/Clickable'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useState } from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import useAdvancedSearchUi from '../advanced-search/stockAdvancedSearchUi'
import { StockAdvancedSearchFilter } from '../advanced-search/advancedSearchFilter'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import AdvancedSearchFilterForm from '../advanced-search/AdvancedSearchFilterForm'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchResultsTable from '../advanced-search/results/SearchResultsTable'

type UiModel = {
  results: StockQuote[]
  editMode?: boolean
  confirmDelete?: boolean
  filterSummary?: StockFilterSummary
  filter: StockAdvancedSearchFilter
} & StockSavedSearch

const SavedSearchTable = ({
  data,
  onRefresh,
  onDeleteItem,
}: {
  data: StockSavedSearch[]
  onRefresh?: () => void
  onDeleteItem: (item: StockSavedSearch) => void
}) => {
  const [selectedItem, setSelectedItem] = useState<UiModel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const scroller = useScrollTop(0)
  const handlePageChange = () => {
    scroller.scroll()
  }
  const controller = useAdvancedSearchUi(selectedItem?.filter)

  const handleClick = async (item: StockSavedSearch) => {
    if (!selectedItem) {
      setIsLoading(true)
      const newItem: UiModel = { ...item, results: [], filter: item.filter, filterSummary: summarizeFilter(item.filter) }
      const result = await executeStockAdvancedSearch(newItem.filter)
      newItem.results = result.Body as StockQuote[]
      setSelectedItem(newItem)
    } else {
      setSelectedItem(null)
    }
    setIsLoading(false)
  }
  const handleEditClick = (item: StockSavedSearch) => {
    controller.setModel({ ...controller.model, filter: item.filter })
    setSelectedItem({ filter: item.filter, name: item.name, id: item.id, results: [], editMode: true })
  }
  const handleDeleteClick = (item: StockSavedSearch) => {
    controller.setModel({ ...controller.model, filter: item.filter })
    setSelectedItem({ filter: item.filter, name: item.name, id: item.id, results: [], editMode: true, confirmDelete: true })
  }

  const menuItems: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit text='edit' />,
      fn: () => {
        if (selectedItem) {
          handleEditClick(selectedItem)
        }
      },
    },
    {
      item: <ContextMenuDelete />,
      fn: () => {
        if (selectedItem) {
          handleDeleteClick(selectedItem)
        }
      },
    },
  ]

  const handleSaved = () => {
    setSelectedItem(null)
    onRefresh?.()
  }
  const handleDelete = async () => {
    if (selectedItem) {
      onDeleteItem({ id: selectedItem.id, name: selectedItem.name, filter: selectedItem.filter })
    }
    setSelectedItem(null)
  }

  return (
    <Box>
      {isLoading && <BackdropLoader />}
      <Box>
        {data.map((item) => (
          <Box key={item.id}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box py={1} width={'90%'}>
                <Clickable
                  onClicked={() => {
                    handleClick(item)
                  }}
                >
                  <ListHeader text={item.name} />
                </Clickable>
              </Box>
              <Box display={'flex'} justifyContent={'flex-end'}>
                {selectedItem && selectedItem.id === item.id && <ContextMenu items={menuItems} />}
              </Box>
            </Box>
            <HorizontalDivider />
            {selectedItem && selectedItem.id === item.id && (
              <Box py={2}>
                {!selectedItem.editMode && (
                  <Box>
                    <ScrollTop scroller={scroller} />
                    <SearchResultsTable data={selectedItem.results} pageSize={5} onPageChanged={handlePageChange} filterSummary={selectedItem.filterSummary} />
                  </Box>
                )}
                {selectedItem.editMode && (
                  <Box>
                    <Box display={'flex'} justifyContent={'flex-end'} pr={2}>
                      <CloseIconButton
                        onClicked={() => {
                          setSelectedItem(null)
                        }}
                      />
                    </Box>
                    <AdvancedSearchFilterForm
                      onSubmitted={() => {}}
                      controller={controller}
                      filter={selectedItem.filter}
                      onSaved={handleSaved}
                      showSubmitButton={false}
                      savedSearchId={selectedItem.id}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      {selectedItem && selectedItem.confirmDelete && (
        <ConfirmDeleteDialog
          show={true}
          text={`are you sure you want to remove ${selectedItem.name} ?`}
          onConfirm={handleDelete}
          onCancel={() => {
            setSelectedItem({ ...selectedItem, confirmDelete: false })
          }}
        />
      )}
    </Box>
  )
}

export default SavedSearchTable
