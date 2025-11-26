import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import StockCalculator from 'components/Organizms/admin/StockCalculator'
import TipCalculator from 'components/Organizms/admin/TipCalculator'
import Seo from 'components/Organizms/Seo'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Calculator' />
      <ResponsiveContainer>
        <PageHeader text='Calculators' />
        <Box pb={4}>
          <TipCalculator />
        </Box>
        <HorizontalDivider />

        <StockCalculator />
      </ResponsiveContainer>
    </>
  )
}

export default Page
