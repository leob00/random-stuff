import { Alert, Box, Snackbar, TextField, Typography } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR, userHasRole, validateUserCSR } from 'lib/backend/auth/userUtil'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/router'
import React from 'react'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { get, post } from 'lib/backend/api/fetchFunctions'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import ReEnterPasswordDialog from 'components/Organizms/Login/ReEnterPasswordDialog'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [loadingResult, setLoadingResult] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [jsonResult, setJsonResult] = React.useState('')
  const [showPasswordPrompt, setShowPasswordPrompt] = React.useState(false)
  const [showLoginSuccess, setShowLoginSuccess] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const fn = async () => {
      const loggedInUser = await getUserCSR()
      if (!loggedInUser) {
        router.push('/login')
        return
      }

      const p = await userController.refetchProfile(300)
      if (p) {
        if (!userHasRole('Admin', loggedInUser.roles)) {
          router.push('/login')
          return
        }
      }

      setUserProfile(p)
      await handleApiSelected('/api/edgeStatus')
      setLoading(false)
    }
    fn()
  }, [userController.username])

  const apiOptions: DropdownItem[] = [
    {
      text: 'status',
      value: '/api/edgeStatus',
    },
    {
      text: 'dogs',
      value: '/api/edgeRandomAnimals?id=dogs',
    },
    {
      text: 'cats',
      value: '/api/edgeRandomAnimals?id=cats',
    },
    {
      text: 'news',
      value: '/api/news?id=GoogleTopStories',
    },
    {
      text: 'recipes',
      value: '/api/recipes',
    },
    {
      text: 'user tasks',
      value: '/api/searchRandomStuff',
    },
  ]

  const handleApiSelected = async (url: string) => {
    setLoadingResult(true)
    let req = url
    if (req.includes('searchRandomStuff')) {
      const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), 'user-goal-tasks[leo_bel@hotmail.com]')
      //req = `/api/searchRandomStuff?id=user-goal-tasks[leo_bel@hotmail.com]&enc=${enc}`
      //console.log('enc: ', enc)
      const body: EncPutRequest = {
        data: enc,
      }
      const result = await post(req, body)
      setJsonResult(JSON.stringify(result))
      setLoadingResult(false)
      return
    }
    const result = await get(req)
    setJsonResult(JSON.stringify(result))
    setLoadingResult(false)
  }

  const handleConfirmLogin = async () => {
    setShowPasswordPrompt(false)
    setShowLoginSuccess(true)
  }
  const handleCloseLoginSuccess = async () => {
    setShowLoginSuccess(false)
  }

  return (
    <>
      <NonSSRWrapper>
        {loading ? (
          <WarmupBox />
        ) : userProfile ? (
          <>
            <BackToHomeButton />
            <CenteredTitle title='Admin' />
            <CenteredTitle title={`Test Api's`} />
            <CenterStack>
              <DropdownList options={apiOptions} selectedOption={'/api/edgeStatus'} onOptionSelected={handleApiSelected} />
            </CenterStack>
            <CenterStack sx={{ py: 4 }}>
              {loadingResult ? (
                <WarmupBox />
              ) : (
                <Box maxHeight={300} sx={{ overflowY: 'auto' }}>
                  <Typography textAlign={'center'} variant='body1'>
                    {jsonResult}
                  </Typography>
                </Box>
              )}
            </CenterStack>

            <CenteredTitle title='Login Test' />
            <CenterStack>
              <SecondaryButton text='show' onClick={() => setShowPasswordPrompt(true)} />
            </CenterStack>
            <ReEnterPasswordDialog
              userProfile={userProfile}
              show={showPasswordPrompt}
              title={'authentication request'}
              text={'please re-enter your password to proceed'}
              onConfirm={handleConfirmLogin}
              onCancel={() => setShowPasswordPrompt(false)}
            />
            <Snackbar
              open={showLoginSuccess}
              autoHideDuration={3000}
              onClose={handleCloseLoginSuccess}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseLoginSuccess} severity='success' sx={{ width: '100%' }}>
                Login succeeded. Thank you!
              </Alert>
            </Snackbar>
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page
