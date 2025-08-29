import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import Seo from 'components/Organizms/Seo'

const index = () => {
  return (
    <>
      <Seo pageTitle={`Advanced Search`} />
      <PageHeader text='Advanced Search' />
      <ResponsiveContainer>
        <CenterStack>
          <AlertWithHeader severity='warning' header='This feature is currently under development.' text='' />
        </CenterStack>
        <Box></Box>
      </ResponsiveContainer>
    </>
  )
}

export default index
