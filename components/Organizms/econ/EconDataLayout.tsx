import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import React from 'react'
import weekday from 'dayjs/plugin/weekday'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import EconDataDetails from '../econ/EconDataDetails'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem, mapDropdownItems } from 'lib/models/dropdown'
import EconDataTable from './EconDataTable'
import CenterStack from 'components/Atoms/CenterStack'
import { useRouter } from 'next/router'
dayjs.extend(weekday)

export interface EconDataModel {
  Body: {
    Item: EconomicDataItem
    Items: EconomicDataItem[]
  }
}

const EconDataLayout = () => {
  const router = useRouter()
  const config = apiConnection().qln
  const mutateListKey = `${config.url}/EconReports`

  const dataFn = async () => {
    const resp = await get(mutateListKey)
    return resp as EconDataModel
  }

  const handleItemClicked = async (item: EconomicDataItem) => {
    const endYear = dayjs(item.LastObservationDate!).year()
    const startYear = dayjs(item.LastObservationDate!).subtract(5, 'years').year()

    router.push(`/csr/economic-indicators/${item.InternalId}?startYear=${startYear}&endYear=${endYear}`)
  }

  const { data, isLoading } = useSwrHelper(mutateListKey, dataFn, { revalidateOnFocus: false })
  const itemLookup: DropdownItem[] = data ? mapDropdownItems(data.Body.Items, 'Title', 'InternalId') : []

  const handleLoad = (item: DropdownItem) => {
    const ex = data?.Body.Items.find((m) => m.InternalId === Number(item.value))
    if (ex) {
      handleItemClicked(ex)
    }
  }

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {!isLoading && data && data.Body.Items.length === 0 && <NoDataFound />}
      {data && (
        <Box>
          <CenterStack>
            <StaticAutoComplete options={itemLookup} fullWidth onSelected={handleLoad} placeholder={`search in ${data.Body.Items.length} results`} />
          </CenterStack>
          <EconDataTable data={data.Body.Items} handleItemClicked={handleItemClicked} />
        </Box>
      )}
    </Box>
  )
}

export default EconDataLayout
