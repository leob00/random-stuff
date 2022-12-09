import { Box, Skeleton, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import router from 'next/router'
import WarmupBox from 'components/Atoms/WarmupBox'
import BackButton from 'components/Atoms/Buttons/BackButton'
import ButtonSkeleton from 'components/Atoms/Skeletons/ButtonSkeleton'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import LinkButton from 'components/Atoms/Buttons/LinkButton'

const UserDashboardLayout = ({ userProfile }: { userProfile: UserProfile }) => {
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
        {isLoading && (
          <>
            <CenterStack>
              <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent }}>
                <Typography variant='subtitle1'>Take Notes</Typography>
              </Skeleton>
            </CenterStack>
            <CenterStack>
              <ButtonSkeleton buttonText='Notes: 00' />
            </CenterStack>
          </>
        )}
        <>
          <CenterStack sx={{ py: 2 }}>
            <LinkButton
              onClick={() => {
                router.push('/protected/csr/notes')
              }}
            >
              {`notes: (${userProfile.noteTitles.length})`}
            </LinkButton>
          </CenterStack>
          <HorizontalDivider />
          <CenterStack sx={{ py: 2 }}>
            <LinkButton
              onClick={() => {
                router.push('/protected/csr/goals')
              }}
            >
              {`goals`}
            </LinkButton>
          </CenterStack>
          <HorizontalDivider />
        </>
      </Box>

      {isLoading && <WarmupBox />}
    </>
  )
}

export default UserDashboardLayout
