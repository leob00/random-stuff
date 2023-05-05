import { Box } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/router'
import React from 'react'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { get, post } from 'lib/backend/api/fetchFunctions'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import MultiDatasetBarchart from 'components/Molecules/Charts/MultiDatasetBarchart'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import JobsLayout from 'components/Organizms/admin/JobsLayout'
import BackButton from 'components/Atoms/Buttons/BackButton'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [loadingResult, setLoadingResult] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)
  const [jsonResult, setJsonResult] = React.useState('')
  const [emailTemplate, setEmailTemplate] = React.useState('')
  const [selectedTab, setSelectedTab] = React.useState('Jobs')
  const router = useRouter()

  const tabs: TabInfo[] = [{ title: 'Jobs', selected: true }, { title: 'Api' }, { title: 'Chart' }, { title: 'Email' }]

  React.useEffect(() => {
    const fn = async () => {
      const loggedInUser = await getUserCSR()
      if (!loggedInUser) {
        router.push('/login')
        return
      }

      const p = await userController.fetchProfilePassive(300)
      if (p) {
        if (!userHasRole('Admin', loggedInUser.roles)) {
          router.push('/login')
          return
        }
      }
      setUserProfile(p)
      await handleApiSelected('/api/edgeStatus')
      setLoading(false)
      const resp = await fetch('/emailTemplates/sendPin.html')
      const html = await resp.text()
      setEmailTemplate(html)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

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
      text: 'user stock lists',
      value: '/api/searchRandomStuff',
    },
  ]

  const handleApiSelected = async (url: string) => {
    setLoadingResult(true)
    let req = url
    if (req.includes('searchRandomStuff')) {
      const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `user-stock_list`)
      const body: SignedRequest = {
        data: enc,
      }
      const result = await post(req, body)
      setJsonResult(JSON.stringify(result, null, 2))
      setLoadingResult(false)
      return
    }
    const result = await get(req)
    setJsonResult(JSON.stringify(result, null, 2))
    setLoadingResult(false)
  }

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  return (
    <ResponsiveContainer>
      {loading ? (
        <WarmupBox />
      ) : userProfile ? (
        <>
          <BackButton onClicked={() => router.push('/protected/csr/dashboard')} />
          <CenteredTitle title='Admin' />
          <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
          {selectedTab === 'Api' && (
            <Box>
              <CenteredTitle title={`Test Api's`} />
              <CenterStack sx={{ pt: 2 }}>
                <DropdownList options={apiOptions} selectedOption={'/api/edgeStatus'} onOptionSelected={handleApiSelected} />
              </CenterStack>
              {loadingResult ? (
                <WarmupBox />
              ) : (
                <CenterStack sx={{ py: 4 }}>
                  <Box maxHeight={300} sx={{ overflowY: 'auto' }}>
                    <pre>{jsonResult}</pre>
                  </Box>
                </CenterStack>
              )}
            </Box>
          )}
          {selectedTab === 'Chart' && (
            <Box>
              <CenteredTitle title='Multi dataset bar chart' />
              <CenterStack>
                <MultiDatasetBarchart />
              </CenterStack>
            </Box>
          )}
          {selectedTab === 'Email' && (
            <Box>
              <CenteredTitle title='Forgot Pin Email Template' />
              <CenterStack>
                <HtmlView html={emailTemplate} />
              </CenterStack>
            </Box>
          )}
          {selectedTab === 'Jobs' && <JobsLayout />}
        </>
      ) : (
        <PleaseLogin />
      )}
    </ResponsiveContainer>
  )
}

export default Page
