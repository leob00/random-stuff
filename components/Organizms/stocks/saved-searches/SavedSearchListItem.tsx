import { Box } from '@mui/material'
import { useState } from 'react'
import { StockSavedSearch } from '../advanced-search/stocksAdvancedSearch'
import { StockQuote } from 'lib/backend/api/models/zModels'
import SearchResultsTable from '../advanced-search/results/SearchResultsTable'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import AdvancedSearchFilterForm from '../advanced-search/AdvancedSearchFilterForm'
import { AdvancedSearchUiController } from '../advanced-search/stockAdvancedSearchUi'
import Clickable from 'components/Atoms/Containers/Clickable'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { executeStockAdvancedSearch } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'

const SavedSearchListItem = ({
  item,
  controller,
  onDelete,
  onSaved,
  onSelected,
}: {
  item: StockSavedSearch
  controller: AdvancedSearchUiController
  onDelete?: (item: StockSavedSearch) => void
  onSaved?: () => void
  onSelected?: (item: StockSavedSearch) => void
}) => {
  const [selectedItem, setSelectedItem] = useState<StockSavedSearch | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [results, setResults] = useState<StockQuote[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const menuItems: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit text='edit' />,
      fn: () => {
        if (selectedItem) {
          setEditMode(true)
        }
      },
    },
    {
      item: <ContextMenuDelete />,
      fn: () => {
        if (selectedItem) {
          onDelete?.(selectedItem)
        }
      },
    },
  ]

  const handlePageChange = () => {}

  const handleSelect = async () => {
    if (selectedItem) {
      setSelectedItem(null)
      setEditMode(false)
      return
    }
    setIsLoading(true)
    const newItem = { ...item }
    const result = await executeStockAdvancedSearch(newItem.filter)
    let res = result.Body as StockQuote[]
    if (newItem.filter.symbols && newItem.filter.symbols.length > 0) {
      res = sortArray(res, ['Symbol'], ['asc'])
    }
    setSelectedItem(newItem)
    setResults(res)
    setEditMode(false)
    setIsLoading(false)
    onSelected?.(newItem)
  }
  const handleCancelEdit = () => {
    setEditMode(false)
  }
  const handleSaved = () => {
    setEditMode(false)
    setSelectedItem(null)
    setResults([])
    onSaved?.()
  }

  return (
    <>
      {isLoading && <ComponentLoader />}
      <Box py={1}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box py={1} width={'90%'}>
            <Clickable onClicked={handleSelect}>
              <ListHeader text={item.name} selected={selectedItem !== null} />
            </Clickable>
          </Box>
          <Box display={'flex'} justifyContent={'flex-end'}>
            {selectedItem && <ContextMenu items={menuItems} />}
          </Box>
        </Box>

        {selectedItem && (
          <Box>
            {selectedItem && results && <ScrollIntoView margin={-24} />}
            <SearchResultsTable data={results} onPageChanged={handlePageChange} />
          </Box>
        )}
        {selectedItem && editMode && (
          <Box>
            <Box display={'flex'} justifyContent={'flex-end'} pr={2}>
              <CloseIconButton onClicked={handleCancelEdit} />
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
    </>
  )
}

export default SavedSearchListItem
