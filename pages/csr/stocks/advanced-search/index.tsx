import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import Seo from 'components/Organizms/Seo'
import AdvancedSearchDisplay from 'components/Organizms/stocks/advanced-search/AdvancedSearchDisplay'

const index = () => {
  return (
    <>
      <Seo pageTitle={`Stock Advanced Search`} />
      <PageHeader text='Stock Advanced Search' />
      <ResponsiveContainer>
        <CenterStack>
          <AlertWithHeader severity='warning' header='This feature is currently under development.' text='' />
        </CenterStack>
        <Box py={2}>
          <AdvancedSearchDisplay />
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default index
