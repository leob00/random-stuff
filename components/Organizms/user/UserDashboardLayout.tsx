import { Box } from '@mui/material'
import React from 'react'
import router from 'next/router'
import WarmupBox from 'components/Atoms/WarmupBox'
import BackButton from 'components/Atoms/Buttons/BackButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredNavigationButton from 'components/Atoms/Buttons/CenteredNavigationButton'

const UserDashboardLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(false)
  }, [isLoading])

  return (
    <>
      <Box sx={{ py: 2 }}>
        <BackButton
          onClicked={() => {
            router.push('/')
          }}
        />
        <HorizontalDivider />
      </Box>
      <Box sx={{ my: 2 }}>
        {isLoading && <WarmupBox text='loading dashboard...' />}
        <>
          <>
            <CenteredNavigationButton route={'/protected/csr/goals'} text={'goals'} />
            <CenteredNavigationButton route={'/protected/csr/notes'} text={'notes'} />
            <CenteredNavigationButton route={'/csr/stocks'} text={'stocks'} />
            <CenteredNavigationButton route={'/protected/csr/secrets'} text={'secrets'} showDivider={false} />
          </>
        </>
      </Box>
      {isLoading && <WarmupBox />}
    </>
  )
}

export default UserDashboardLayout
