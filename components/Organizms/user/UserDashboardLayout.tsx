import { Box } from '@mui/material'
import React from 'react'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'

const UserDashboardLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  return (
    <>
      <Box sx={{ my: 2 }}>
        <>
          <CenteredNavigationButton route={'/csr/news'} text={'news'} />
          <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
          <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
          <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
          <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} showDivider={false} />
        </>
      </Box>
    </>
  )
}

export default UserDashboardLayout
