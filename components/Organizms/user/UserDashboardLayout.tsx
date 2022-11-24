import { Box, Skeleton, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import router from 'next/router'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { Divider } from '@aws-amplify/ui-react'
import WarmupBox from 'components/Atoms/WarmupBox'
import BackButton from 'components/Atoms/Buttons/BackButton'
import ButtonSkeleton from 'components/Atoms/Skeletons/ButtonSkeleton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { useUserController } from 'hooks/userController'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'

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
          <CenterStack>
            <Typography variant='subtitle1'>Take Notes</Typography>
            <CenteredTitle title={'Take Notes'} />
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            <SecondaryButton
              onClick={() => {
                router.push('/protected/csr/notes')
              }}
              text={`Notes: ${userProfile.noteTitles.length}`}
            ></SecondaryButton>
          </CenterStack>
          <HorizontalDivider />
          <CenterStack>
            <Typography variant='subtitle1'>Finish Tasks</Typography>
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            <SecondaryButton
              onClick={() => {
                router.push('/protected/csr/tasks')
              }}
              text={'Tasks'}
            ></SecondaryButton>
          </CenterStack>
        </>
      </Box>

      {isLoading && <WarmupBox />}
    </>
  )
}

export default UserDashboardLayout
