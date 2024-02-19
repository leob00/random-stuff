import React from 'react'
import { useRouter } from 'next/router'
import Seo from 'components/Organizms/Seo'
import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import { DropdownItem } from 'lib/models/dropdown'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { getReport } from 'lib/backend/api/qln/qlnApi'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import { useSwrHelper } from 'hooks/useSwrHelper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PagedStockTable from 'components/Organizms/stocks/PagedStockTable'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import StockReportDisplay from 'components/Organizms/stocks/StockReportDisplay'
const Page = () => {
  const router = useRouter()

  const dropdown: DropdownItem[] = [
    { text: 'Volume Leaders', value: 'volume-leaders' },
    { text: 'Market Cap Leaders', value: 'market-cap-leaders' },
    { text: 'Sectors', value: 'sectors' },
    { text: 'Industries', value: 'industries' },
  ]
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

  const handleReportSelected = (value: string) => {
    switch (value) {
      case 'sectors':
        router.push('/csr/stocks/sectors')
        break
      case 'industries':
        router.push('/csr/stocks/industries')
        break
      default:
        router.replace(`/ssg/stocks/reports/${value}`, undefined, { scroll: false })
        break
    }
  }

  return (
    <>
      <Seo pageTitle={`Stock reports - ${selectedOption.text}`} />
      <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
      <ResponsiveContainer>
        <Box pt={2}>
          <CenterStack>
            <DropdownList options={dropdown} selectedOption={selectedOption.value} onOptionSelected={handleReportSelected} />
          </CenterStack>
        </Box>

        {isLoading && <BackdropLoader />}
        {data && !isLoading && <StockReportDisplay data={data} />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
