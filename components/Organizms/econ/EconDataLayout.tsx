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
import EconDataDetails from '../econ/EconDataDetails'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
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
  const [selectedItem, setSelectedItem] = React.useState<EconomicDataItem | null>(null)

  const handleItemClicked = async (item: EconomicDataItem) => {
    const modelCopy = { ...data }
    const endYear = dayjs(item.LastObservationDate!).year()
    const startYear = dayjs(item.LastObservationDate!).subtract(5, 'years').year()
    const criteria: EconDataCriteria = {
      id: String(item.InternalId),
      startYear,
      endYear,
    }
    if (modelCopy) {
      setIsWaiting(true)
      setSelectedItem(null)
      const existing = data?.Body.Items.find((m) => m.InternalId === item.InternalId)
      if (existing) {
        // const url = `${config.url}/EconReports`
        // const resp = (await post(url, { Id: item.InternalId, StartYear: startYear, EndYear: endYear })) as EconDataModel
        const result = await getEconDataReport(item.InternalId, startYear, endYear)
        setSelectedItem({ ...existing, criteria: criteria, Chart: result.Chart })
      }
      setIsWaiting(false)
    }
  }

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
    const ex = data?.Body.Items.find((m) => m.InternalId === Number(item.value))
    if (ex) {
      handleItemClicked(ex)
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
            <StaticAutoComplete options={allItems} onSelected={handleLoad} placeholder={`search in ${data.Body.Items.length} results`} />
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
