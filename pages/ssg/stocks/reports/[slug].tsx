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
const Page = () => {
  const router = useRouter()

  const dropdown: DropdownItem[] = [
    { text: 'Volume Leaders', value: 'volumeleaders' },
    { text: 'Market Cap Leaders', value: 'marketcapleaders' },
    { text: 'Sectors', value: 'sectors' },
  ]
  let selectedOption = dropdown.find((m) => m.value === router.query.slug)
  if (!selectedOption) {
    selectedOption = dropdown[0]
  }

  const dataFn = async () => {
    const result = await getReport(selectedOption!.value as StockReportTypes)
    return result
  }

  const { data, isLoading } = useSwrHelper(selectedOption.value, dataFn)

  const handleReportSelected = (value: string) => {
    if (value === 'sectors') {
      router.push('/csr/stocks/sectors')
      return
    }
    router.replace(`/ssg/stocks/reports/${value}`, undefined, { scroll: false })
  }

  return (
    <>
      <Seo pageTitle={`Stock reports - ${selectedOption.text}`} />
      <PageHeader text='Stock Reports' />
      <ResponsiveContainer>
        <Box pt={2}>
          <CenterStack>
            <DropdownList options={dropdown} selectedOption={selectedOption.value} onOptionSelected={handleReportSelected} />
          </CenterStack>
        </Box>
        {isLoading && <BackdropLoader />}
        {data && (
          <>
            <PagedStockTable data={data} />
          </>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
