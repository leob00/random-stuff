import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import AdvancedSearchDisplay from 'components/Organizms/stocks/advanced-search/AdvancedSearchDisplay'

const index = () => {
  return (
    <>
      <Seo pageTitle={`Stock Advanced Search`} />
      <PageHeader text='Stock Advanced Search' />
      <ResponsiveContainer>
        <Box py={2}>
          <AdvancedSearchDisplay />
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default index
