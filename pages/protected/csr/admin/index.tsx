import { Box, Typography } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { axiosGet } from 'lib/backend/api/qln/useAxios'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/router'
import React from 'react'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { EncPutRequest } from 'lib/backend/csr/nextApiWrapper'
import { post } from 'lib/backend/api/fetchFunctions'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [loadingResult, setLoadingResult] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [jsonResult, setJsonResult] = React.useState('')
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

  const searchTasksUrl = `/api/searchRandomStuff?id=user-goal-tasks[leo_bel@hotmail.com]`

  const apiOptions: DropdownItem[] = [
    {
      text: 'status',
      value: '/api/edgeStatus',
    },
    {
      text: 'dogs',
      value: '/api/dogs',
    },
    {
      text: 'cats',
      value: '/api/cats',
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
      console.log('enc: ', enc)
      const body: EncPutRequest = {
        data: enc,
      }
      const result = await post(req, body)
      setJsonResult(JSON.stringify(result))
      setLoadingResult(false)
      return
    }
    const result = await axiosGet(req)
    setJsonResult(JSON.stringify(result))
    setLoadingResult(false)
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
          </>
        ) : (
          <PleaseLogin />
        )}
      </NonSSRWrapper>
    </>
  )
}

export default Page
