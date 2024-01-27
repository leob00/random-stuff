import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { EconCalendarItem, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import useSWR, { Fetcher, mutate } from 'swr'
import weekday from 'dayjs/plugin/weekday'
import EconCalendarDisplay from './EconCalendarDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import EconDataChart from '../econ/EconDataChart'
import { replaceItemInArray } from 'lib/util/collections'
import EconDataDetails from '../econ/EconDataDetails'
dayjs.extend(weekday)

interface Model {
  Body: {
    Item: EconomicDataItem
    Items: EconomicDataItem[]
  }
}

const EconDataLayout = () => {
  const config = apiConnection().qln
  const mutateListKey = `${config.url}/EconomicData`

  const dataFn = async () => {
    const resp = await get(mutateListKey)
    //console.log(resp)
    return resp as Model
  }

  const [isWaiting, setIsWaiting] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<EconomicDataItem | null>(null)

  const handleItemClicked = async (item: EconomicDataItem) => {
    const modelCopy = { ...data }

    if (modelCopy) {
      setIsWaiting(true)
      setSelectedItem(null)
      const newItems = modelCopy.Body!.Items
      const existing = newItems.find((m) => m.InternalId === item.InternalId)!
      const url = `${config.url}/EconomicData`
      const resp = (await get(url, { id: item.InternalId })) as Model
      const result = resp.Body.Item
      setSelectedItem(result)
      setIsWaiting(false)

      // if (!item.Chart) {
      //   setIsWaiting(true)
      //   const url = `${config.url}/EconomicData`
      //   const resp = (await get(url, { id: item.InternalId })) as Model
      //   const result = resp.Body.Item
      //   existing.Chart = result.Chart!
      //   setIsWaiting(false)
      //   replaceItemInArray(existing, newItems, 'InternalId', item.InternalId)
      //   const newModel = { ...modelCopy, Items: newItems }
      //   mutate(mutateListKey, newModel, { revalidate: false })
      // }
      // else {
      //   const newItems = modelCopy.Body!.Items
      //   existing.Chart = null
      //   replaceItemInArray(existing, newItems, 'InternalId', item.InternalId)
      //   const newModel = { ...modelCopy, Items: newItems }
      //   mutate(mutateListKey, newModel, { revalidate: false })
      // }
    }
  }
  const { data, isLoading } = useSwrHelper(mutateListKey, dataFn)

  return (
    <Box py={2}>
      {(isLoading || isWaiting) && <BackdropLoader />}

      {!isLoading && data && data.Body.Items.length === 0 && <NoDataFound />}
      {data && (
        <Box py={2}>
          {data.Body.Items.map((item) => (
            <Box key={item.InternalId}>
              <ListHeader item={item} text={item.Title} onClicked={handleItemClicked} />
              {/* {item.Chart && (
                <Box py={2}>
                  <EconDataDetails item={item} />
                </Box>
              )} */}
            </Box>
          ))}
        </Box>
      )}
      {selectedItem && (
        <FormDialog title={selectedItem.Title} show={true} onCancel={() => setSelectedItem(null)} fullScreen>
          <EconDataDetails item={selectedItem} />
        </FormDialog>
      )}
    </Box>
  )
}

export default EconDataLayout
