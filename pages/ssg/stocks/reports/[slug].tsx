import React from 'react'
import { useRouter } from 'next/router'
import Seo from 'components/Organizms/Seo'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getReport } from 'lib/backend/api/qln/qlnApi'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import { useSwrHelper } from 'hooks/useSwrHelper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StockReportDisplay from 'components/Organizms/stocks/StockReportDisplay'
import StockReportsDropdown, { stockReportsDropdown } from 'components/Organizms/stocks/reports/StockReportsDropdown'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
const Page = () => {
  const router = useRouter()
  const [sort, setSort] = React.useState<Sort[]>([
    {
      key: 'MarketCap',
      direction: 'desc',
    },
  ])
  const dropdown = stockReportsDropdown
  const id = String(router.query.slug)

  let selectedOption = dropdown.find((m) => m.value === id)
  if (!selectedOption) {
    selectedOption = dropdown[0]
  }

  const dataFn = async () => {
    const arg = selectedOption?.value.replaceAll('-', '') as StockReportTypes
    const result = await getReport(arg)
    return result
  }

  const { data, isLoading } = useSwrHelper(selectedOption.value, dataFn, { revalidateOnFocus: false })

  return (
    <>
      <Seo pageTitle={`Stock reports - ${selectedOption.text}`} />
      <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
      <ResponsiveContainer>
        <StockReportsDropdown selectedValue={selectedOption.value} />
        {isLoading && <BackdropLoader />}
        {data && <StockReportDisplay data={data} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
