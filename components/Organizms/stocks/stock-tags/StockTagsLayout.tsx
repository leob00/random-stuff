import { Box, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { post } from 'lib/backend/api/fetchFunctions'
import { QlnApiRequest, QlnApiResponse, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import { orderBy } from 'lodash'
import React, { useState } from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockTable from '../PagedStockTable'
import { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { sortArray } from 'lib/util/collections'
import { useRouter } from 'next/router'

const StockTagsLayout = ({ allTags, selectedTag }: { allTags: string[]; selectedTag?: string | null }) => {
  const router = useRouter()
  const tags = orderBy(allTags)
  const options: DropdownItem[] = tags.map((m) => {
    return {
      text: m,
      value: m,
    }
  })

  const [selectedItem, setSelectedItem] = useState(selectedTag ? options.find((m) => m.value === selectedTag) : options[0])
  const allTagsFn = async () => {
    const req: QlnApiRequest = {
      key: selectedItem?.value,
    }
    const result = await serverPostFetch(req, '/StockTags')
    const quotes = result.Body as StockQuote[]
    return sortArray(quotes, ['MarketCap'], ['desc'])
  }
  const key = `all-stock-tags-${selectedItem?.value}`
  const { data, isLoading } = useSwrHelper(key, allTagsFn, { revalidateOnFocus: false })

  const handleSelected = (item: DropdownItem) => {
    setSelectedItem(options.find((m) => m.value === item.value))
    router.replace(`/csr/stocks/stock-tags?id=${encodeURIComponent(item.value)}`)
    mutate(key)
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Stack py={2} flexDirection={'row'} justifyContent={'center'} gap={2} alignItems={'center'}>
        <StaticAutoComplete options={options} onSelected={handleSelected} selectedItem={selectedItem} disableClearable fullWidth />
      </Stack>
      <Box key={selectedTag}>{data && <PagedStockTable data={data} />}</Box>
    </>
  )
}

export default StockTagsLayout
