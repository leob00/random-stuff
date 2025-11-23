import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem, mapDropdownItems } from 'lib/models/dropdown'
import EconDataTable from './EconDataTable'
import CenterStack from 'components/Atoms/CenterStack'
import { useRouter } from 'next/router'
import { useState } from 'react'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { getSortablePropsFromArray, SortableItem } from 'components/dnd/dndUtil'
import DragAndDropSort from 'components/dnd/DragAndDropSort'
import { serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

export interface EconDataModel {
  Body: {
    Item: EconomicDataItem
    Items: EconomicDataItem[]
  }
}

const EconDataLayout = () => {
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()
  const mutateListKey = `economic-indicators-list`

  const { economicIndicators, saveEconomicIndicators } = useLocalStore()

  const dataFn = async () => {
    const resp = await serverGetFetch('/EconReports')
    const dbResult = resp as EconDataModel
    const stateIndicators = getMapFromArray(economicIndicators, 'InternalId')
    dbResult.Body.Items.forEach((item) => {
      stateIndicators.set(item.InternalId, item)
    })
    const result = Array.from(stateIndicators.values())
    saveEconomicIndicators(result)
    dbResult.Body.Items = result
    return dbResult
  }

  const { data, isLoading } = useSwrHelper(mutateListKey, dataFn, { revalidateOnFocus: false })
  const itemLookup: DropdownItem[] = data ? mapDropdownItems(data.Body.Items, 'Title', 'InternalId') : []

  const handleItemClicked = async (item: EconomicDataItem) => {
    const endYear = dayjs(item.LastObservationDate!).year()
    const startYear = dayjs(item.LastObservationDate!).subtract(10, 'years').year()
    router.push(`/csr/economic-indicators/${item.InternalId}?startYear=${startYear}&endYear=${endYear}`)
  }

  const handleLoad = (item: DropdownItem) => {
    const ex = data?.Body.Items.find((m) => m.InternalId === Number(item.value))
    if (ex) {
      handleItemClicked(ex)
    }
  }

  const handleReorder = (items: SortableItem[]) => {
    saveEconomicIndicators(items.flatMap((m) => m.data as EconomicDataItem[]))
  }

  const sortableItems = getSortablePropsFromArray(economicIndicators, 'InternalId', 'Title')

  return (
    <Box py={2}>
      {!isLoading && data && data.Body.Items.length === 0 && <NoDataFound />}
      {data && (
        <Box>
          <CenterStack>
            <StaticAutoComplete options={itemLookup} fullWidth onSelected={handleLoad} placeholder={`search in ${data.Body.Items.length} results`} />
          </CenterStack>
          <Box display={'flex'} justifyContent={'flex-end'} pt={2}>
            {!editMode ? <LinkButton onClick={() => setEditMode(true)}>edit</LinkButton> : <LinkButton onClick={() => setEditMode(false)}>close</LinkButton>}
          </Box>
          {isLoading && <ComponentLoader />}
          {editMode ? (
            <Box>
              <DragAndDropSort items={sortableItems} onPushChanges={handleReorder} />
            </Box>
          ) : (
            <EconDataTable data={economicIndicators} handleItemClicked={handleItemClicked} />
          )}
        </Box>
      )}
    </Box>
  )
}

export default EconDataLayout
