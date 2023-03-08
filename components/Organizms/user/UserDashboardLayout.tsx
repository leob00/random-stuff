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
import TabButton from 'components/Atoms/Buttons/TabButton'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'

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
          {/* <Box display={'flex'} justifyContent={'space-evenly'}>
            <LinkButton
              onClick={() => {
                router.push('/protected/csr/notes')
              }}>
              {`notes: ${userProfile.noteTitles.length}`}
            </LinkButton>
            <LinkButton
              onClick={() => {
                router.push('/protected/csr/goals')
              }}>
              {`goals`}
            </LinkButton>
            <LinkButton
              onClick={() => {
                router.push('/csr/stocks')
              }}>
              {`stocks`}
            </LinkButton>
            <LinkButton
              onClick={() => {
                router.push('/protected/csr/secrets')
              }}>
              {`secrets`}
            </LinkButton>
          </Box> */}
          <>
            <CenterStack sx={{ py: 2 }}>
              <LinkButton
                onClick={() => {
                  router.push('/protected/csr/notes')
                }}
              >
                <Typography variant={'h5'}>notes</Typography>
              </LinkButton>
            </CenterStack>
            <HorizontalDivider />
            <CenterStack sx={{ py: 2 }}>
              <LinkButton
                onClick={() => {
                  router.push('/protected/csr/goals')
                }}
              >
                <Typography variant={'h5'}>goals</Typography>
              </LinkButton>
            </CenterStack>
            <HorizontalDivider />
            <CenterStack sx={{ py: 2 }}>
              <LinkButton
                onClick={() => {
                  router.push('/csr/stocks')
                }}
              >
                <Typography variant={'h5'}>stocks</Typography>
              </LinkButton>
            </CenterStack>
            <HorizontalDivider />

            <CenterStack sx={{ py: 2 }}>
              <LinkButton
                onClick={() => {
                  router.push('/protected/csr/secrets')
                }}
              >
                <Typography variant={'h5'}>secrets</Typography>
              </LinkButton>
            </CenterStack>
          </>
        </>
      </Box>
      {isLoading && <WarmupBox />}
    </>
  )
}

export default UserDashboardLayout
