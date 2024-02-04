import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get, post } from 'lib/backend/api/fetchFunctions'
import React from 'react'
import weekday from 'dayjs/plugin/weekday'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { EconDataCriteria, EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import EconDataDetails from './EconDataDetails'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
dayjs.extend(weekday)

export interface EconDataModel {
  Body: {
    Item: EconomicDataItem
    Items: EconomicDataItem[]
  }
}

const EconDataLayout = () => {
  const config = apiConnection().qln
  const mutateListKey = `${config.url}/EconReports`

  const dataFn = async () => {
    const resp = await get(mutateListKey)
    return resp as EconDataModel
  }

  const [isWaiting, setIsWaiting] = React.useState(false)
  // const [searchWithinList, setSearchWithinList] = React.useState('')
  const [selectedItem, setSelectedItem] = React.useState<EconomicDataItem | null>(null)

  const handleItemClicked = async (item: EconomicDataItem) => {
    const modelCopy = { ...data }
    const endYear = dayjs(item.LastObservationDate!).year()
    const startYear = dayjs(item.LastObservationDate!).subtract(10, 'years').year()
    const criteria: EconDataCriteria = {
      id: item.InternalId,
      startYear,
      endYear,
    }
    if (modelCopy) {
      setIsWaiting(true)
      setSelectedItem(null)
      const existing = data?.Body.Items.find((m) => m.InternalId === item.InternalId)
      if (existing) {
        const url = `${config.url}/EconReports`
        const resp = (await post(url, { Id: item.InternalId, StartYear: startYear, EndYear: endYear })) as EconDataModel
        setSelectedItem({ ...existing, criteria: criteria, Chart: resp.Body.Item.Chart })
      }
      setIsWaiting(false)
    }
  }

  // const filterList = (items: EconomicDataItem[]) => {
  //   if (searchWithinList.length === 0) {
  //     return items
  //   }
  //   return items.filter((m) => m.Title.toLowerCase().includes(searchWithinList.toLowerCase()))
  // }

  const { data, isLoading } = useSwrHelper(mutateListKey, dataFn, { revalidateOnFocus: false })
  const allItems: DropdownItem[] = data
    ? data.Body.Items.map((m) => {
        return {
          text: m.Title,
          value: String(m.InternalId),
        }
      })
    : []
  const handleLoad = (item: DropdownItem) => {
    const ex = allItems.find((m) => m.value === item.value)
    console.log('ex: ', ex)
    if (ex) {
      // handleItemClicked(ex)
    }
  }

  return (
    <Box py={2}>
      {(isLoading || isWaiting) && <BackdropLoader />}
      {!isLoading && data && data.Body.Items.length === 0 && <NoDataFound />}
      {data && (
        <>
          {selectedItem && selectedItem.Chart && (
            <Box py={2}>
              <EconDataDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
            </Box>
          )}
          <Box py={2} sx={{ display: selectedItem ? 'none' : 'unset' }}>
            {/* <SearchWithinList text={`search in ${data.Body.Items.length} results`} onChanged={(text: string) => setSearchWithinList(text)} /> */}
            <StaticAutoComplete options={allItems} onSelected={handleLoad} />
            {data.Body.Items.map((item) => (
              <Box key={item.InternalId}>
                <ListHeader item={item} text={item.Title} onClicked={handleItemClicked} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default EconDataLayout
