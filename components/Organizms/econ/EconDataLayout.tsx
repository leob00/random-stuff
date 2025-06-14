import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
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
import DraggableEconList, { SortableEconDataItem } from './economic-indicators/DraggableEconList'

export interface EconDataModel {
  Body: {
    Item: EconomicDataItem
    Items: EconomicDataItem[]
  }
}

const EconDataLayout = () => {
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()
  const config = apiConnection().qln
  const mutateListKey = `${config.url}/EconReports`

  const { economicIndicators, saveEconomicIndicators } = useLocalStore()

  const dataFn = async () => {
    const resp = await get(mutateListKey)
    const dbResult = resp as EconDataModel
    const stateIndicators = getMapFromArray(economicIndicators, 'InternalId')
    dbResult.Body.Items.forEach((item) => {
      stateIndicators.set(item.InternalId, item)
    })
    const result = Array.from(stateIndicators.values())
    saveEconomicIndicators(result)
    const sortableItems = mapToSortable(result)
    dbResult.Body.Items = sortableItems
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

  const handleReorder = (items: EconomicDataItem[]) => {
    saveEconomicIndicators(items)
  }

  const sortableItems = mapToSortable(economicIndicators)

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {!isLoading && data && data.Body.Items.length === 0 && <NoDataFound />}
      {data && (
        <Box>
          <CenterStack>
            <StaticAutoComplete options={itemLookup} fullWidth onSelected={handleLoad} placeholder={`search in ${data.Body.Items.length} results`} />
          </CenterStack>
          <Box display={'flex'} justifyContent={'flex-end'} pt={2}>
            {!editMode ? <LinkButton onClick={() => setEditMode(true)}>edit</LinkButton> : <LinkButton onClick={() => setEditMode(false)}>close</LinkButton>}
          </Box>
          {editMode ? (
            <Box>
              <DraggableEconList items={sortableItems} onPushChanges={handleReorder} />
            </Box>
          ) : (
            <EconDataTable data={economicIndicators} handleItemClicked={handleItemClicked} />
          )}
        </Box>
      )}
    </Box>
  )
}

const mapToSortable = (items: EconomicDataItem[]) => {
  const sortableItems: SortableEconDataItem[] = items.map((m) => {
    return {
      InternalId: m.InternalId,
      Chart: m.Chart,
      Notes: m.Notes,
      Title: m.Title,
      Units: m.Units,
      Value: m.Value,
      id: String(m.InternalId),
      title: m.Title,
      criteria: m.criteria,
      FirstObservationDate: m.FirstObservationDate,
      LastObservationDate: m.LastObservationDate,
      PreviousObservationDate: m.PreviousObservationDate,
      PreviousValue: m.PreviousValue,
      Priority: m.Priority,
    }
  })
  return sortableItems
}

export default EconDataLayout
