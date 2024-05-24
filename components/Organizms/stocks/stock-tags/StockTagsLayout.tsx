import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { post } from 'lib/backend/api/fetchFunctions'
import { QlnApiRequest, QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { DropdownItem } from 'lib/models/dropdown'
import { orderBy } from 'lodash'
import React, { useState } from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockTable from '../PagedStockTable'
import { mutate } from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { sortArray } from 'lib/util/collections'
import { useRouter } from 'next/router'

const StockTagsLayout = ({ allTags, selectedTag }: { allTags: string[]; selectedTag: string }) => {
  const router = useRouter()
  const conn = apiConnection().qln
  const tags = orderBy(allTags)
  const options: DropdownItem[] = tags.map((m) => {
    return {
      text: m,
      value: m,
    }
  })

  const [selectedItem, setSelectedItem] = useState(options.find((m) => m.value === selectedTag))
  const allTagsFn = async () => {
    const req: QlnApiRequest = {
      key: selectedItem?.value,
    }
    const resp = await post(`/api/qln?url=${conn.url}/StockTags`, req)
    const result = resp as QlnApiResponse
    const quotes = result.Body as StockQuote[]
    return sortArray(quotes, ['MarketCap'], ['desc'])
  }
  const key = `all-stock-tags-${selectedItem?.value}`
  const { data, isLoading } = useSwrHelper(key, allTagsFn, { revalidateOnFocus: false })

  const handleSelected = (item: DropdownItem) => {
    setSelectedItem(options.find((m) => m.value === item.value))
    //mutate(key)
    router.replace(`/csr/stocks/stock-tags?id=${encodeURIComponent(item.value)}`, undefined, { unstable_skipClientCache: true, scroll: true })
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      <CenterStack sx={{ py: 2 }}>
        <StaticAutoComplete options={options} onSelected={handleSelected} selectedItem={selectedItem} disableClearable />
      </CenterStack>
      <Box key={selectedTag}>{data && <PagedStockTable data={data} />}</Box>
    </>
  )
}

export default StockTagsLayout
