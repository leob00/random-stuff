import { Box } from '@mui/material'
import { StockSavedSearch, StockFilterSummary, hasSymbolsFilter } from '../advanced-search/stocksAdvancedSearch'
import { useState } from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import useAdvancedSearchUi from '../advanced-search/stockAdvancedSearchUi'
import { StockAdvancedSearchFilter } from '../advanced-search/advancedSearchFilter'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import SavedSearchListItem from './SavedSearchListItem'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

type SavedSearchUiModel = {
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
  const [selectedItem, setSelectedItem] = useState<SavedSearchUiModel | null>(null)

  const controller = useAdvancedSearchUi(selectedItem?.filter)

  const handleDeleteClick = (item: StockSavedSearch) => {
    controller.setModel({ ...controller.model, filter: item.filter })
    setSelectedItem({ filter: item.filter, name: item.name, id: item.id, results: [], editMode: true, confirmDelete: true })
  }

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

  const handleSelected = (item: StockSavedSearch) => {
    setSelectedItem({ filter: item.filter, name: item.name, id: item.id, results: [], editMode: true, confirmDelete: false })
    controller.setModel({ ...controller.model, expandSymbols: hasSymbolsFilter(item.filter.symbols) })
  }

  return (
    <Box>
      <Box>
        {data.map((item, index) => (
          <Box key={item.id}>
            <SavedSearchListItem item={item} controller={controller} onDelete={handleDeleteClick} onSaved={handleSaved} onSelected={handleSelected} />
            <HorizontalDivider />
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
