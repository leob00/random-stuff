import React from 'react'
import { useRouter } from 'next/router'
import Seo from 'components/Organizms/Seo'
import BackButton from 'components/Atoms/Buttons/BackButton'
import { Box, Typography } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import { DropdownItem } from 'lib/models/dropdown'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
const Page = () => {
  const router = useRouter()

  const dropdown: DropdownItem[] = [
    { text: 'Volume Leaders', value: 'volumeleaders' },
    { text: 'Market Cap Leaders', value: 'marketcapleaders' },
  ]
  // let selectedOption = dropdown.find((m) => m.value === router.query.slug)
  // if (!selectedOption) {
  //   selectedOption = dropdown[0]
  // }

  const handleReportSelected = (value: string) => {
    router.push(`/csr/stocks/reports/${value}`)
  }

  return (
    <>
      <Seo pageTitle='Stock reports' />
      {/* <BackButton route='/csr/stocks' /> */}
      <PageHeader text='Stock Reports' backButtonRoute='/csr/stocks' />
      <CenterStack>{router.query.slug}</CenterStack>
      <ResponsiveContainer>
        <Box pt={2}>
          <CenterStack>
            <DropdownList options={dropdown} selectedOption={dropdown[0].value} onOptionSelected={handleReportSelected} />
          </CenterStack>
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
