import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import Seo from 'components/Organizms/Seo'
import StockTagsLayout from 'components/Organizms/stocks/stock-tags/StockTagsLayout'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const conn = apiConnection().qln

  const allTagsFn = async () => {
    const resp = await get(`/api/qln?url=${conn.url}/StockTags`)
    const result = resp as QlnApiResponse
    return result.Body
  }
  const key = 'all-stock-tags'
  const { data, isLoading } = useSwrHelper(key, allTagsFn, { revalidateOnFocus: false })

  const searchParams = useSearchParams()
  const selectedTag = searchParams?.get('id')

  return (
    <>
      <Seo pageTitle='Stock Tags' />
      <ResponsiveContainer>
        {isLoading && <BackdropLoader />}
        <PageHeader text='Stock Tags' />
        {data && <StockTagsLayout key={selectedTag} allTags={data} selectedTag={selectedTag} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
