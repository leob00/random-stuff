import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import { getUserCSR, userHasRole } from 'lib/backend/auth/userUtil'
import { useRouter } from 'next/router'
import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import JobsLayout from 'components/Organizms/admin/JobsLayout'
import BackButton from 'components/Atoms/Buttons/BackButton'
import Seo from 'components/Organizms/Seo'
import ApiTest from 'components/Organizms/admin/ApiTest'
import Calculator from 'components/Organizms/admin/Calculator'
import TabList from 'components/Atoms/Buttons/TabList'
import ServerInfo from 'components/Organizms/admin/ServerInfo'
import RequireClaim from 'components/Organizms/user/RequireClaim'

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
          <></>
        ) : userProfile ? (
          <>
            <BackButton />
            <CenteredTitle title='Admin' />
            <RequireClaim claimType='qln'>
              <>
                <TabList tabs={tabs} onSetTab={handleSelectTab} />
                {selectedTab === 'Api' && <ApiTest />}
                {selectedTab === 'Server' && <ServerInfo />}
                {selectedTab === 'Calculator' && <Calculator />}
                {selectedTab === 'Jobs' && <JobsLayout />}
              </>
            </RequireClaim>
          </>
        ) : (
          <PleaseLogin />
        )}
      </ResponsiveContainer>
    </>
  )
}

export default Page
