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
import Calculator from 'components/Organizms/admin/Calculator'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import TabList from 'components/Atoms/Buttons/TabList'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)

  const [emailTemplate, setEmailTemplate] = React.useState('')
  const [selectedTab, setSelectedTab] = React.useState('Jobs')
  const router = useRouter()

  const tabs: TabInfo[] = [{ title: 'Jobs', selected: true }, { title: 'Server' }, { title: 'Api' }, { title: 'Calculator' }]

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

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  return (
    <>
      <Seo pageTitle='Admin' />
      <ResponsiveContainer>
        {loading ? (
          <WarmupBox />
        ) : userProfile ? (
          <>
            <BackButton />
            <CenteredTitle title='Admin' />
            <TabList tabs={tabs} onSetTab={handleSelectTab} />
            {selectedTab === 'Api' && <ApiTest />}
            {selectedTab === 'Server' && (
              <Box py={2}>
                <CenteredHeader title='Random Stuff' />
                <CenterStack sx={{ py: 2 }}>
                  <InternalLink text='health check' route={'/ssr/healthcheck'} />
                </CenterStack>
                <HorizontalDivider />
                <CenteredHeader title='Quote Lookup .NET' />
                <CenterStack>
                  <Link href={'https://server6.m6.net:8443/'} target={'_blank'} sx={{}}>
                    <Typography>Web Server Administration</Typography>
                  </Link>
                </CenterStack>
                <CenterStack sx={{ pt: 2 }}>
                  <Typography>Database: 192.99.150.165</Typography>
                </CenterStack>
              </Box>
            )}
            {selectedTab === 'Calculator' && <Calculator />}
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
