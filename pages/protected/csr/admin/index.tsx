import { Box, Link, Typography } from '@mui/material'
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
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import JobsLayout from 'components/Organizms/admin/JobsLayout'
import BackButton from 'components/Atoms/Buttons/BackButton'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FormExample from 'components/Organizms/admin/FormExample'
import Seo from 'components/Organizms/Seo'
import ApiTest from 'components/Organizms/admin/ApiTest'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)

  const [emailTemplate, setEmailTemplate] = React.useState('')
  const [selectedTab, setSelectedTab] = React.useState('Jobs')
  const router = useRouter()

  const tabs: TabInfo[] = [{ title: 'Jobs', selected: true }, { title: 'Api' }, { title: 'Links' }, { title: 'Form' }]

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
      setLoading(false)
      const resp = await fetch('/emailTemplates/sendPin.html')
      const html = await resp.text()
      setEmailTemplate(html)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }

  return (
    <>
      <Seo pageTitle='Admin' />
      <ResponsiveContainer>
        {loading ? (
          <WarmupBox />
        ) : userProfile ? (
          <>
            <BackButton onClicked={() => router.push('/protected/csr/dashboard')} />
            <CenteredTitle title='Admin' />
            <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
            {selectedTab === 'Api' && <ApiTest />}
            {selectedTab === 'Links' && (
              <Box py={2}>
                <CenteredTitle title='Helpful Links' />
                <HorizontalDivider />
                <CenterStack sx={{ py: 2 }}>
                  <InternalLink text='health status SSR' route={'/ssr/healthcheck'} />
                </CenterStack>
                <CenterStack sx={{ py: 2 }}>
                  <Link href={'https://server6.m6.net:8443/'} target={'_blank'} sx={{ textDecoration: 'none' }}>
                    <Typography>Quote Lookup Administration</Typography>
                  </Link>
                </CenterStack>
              </Box>
            )}
            {selectedTab === 'Form' && <FormExample />}
            {selectedTab === 'Jobs' && <JobsLayout />}
          </>
        ) : (
          <PleaseLogin />
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
