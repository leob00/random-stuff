import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUserCSR, userHasRole, validateUserCSR } from 'lib/backend/auth/userUtil'
import { useRouter } from 'next/router'
import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import JobsLayout from 'components/Organizms/admin/JobsLayout'
import BackButton from 'components/Atoms/Buttons/BackButton'
import Seo from 'components/Organizms/Seo'
import ApiTest from 'components/Organizms/admin/ApiTest'
import TabList from 'components/Atoms/Buttons/TabList'
import ServerInfo from 'components/Organizms/admin/ServerInfo'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UsersAdmin from 'components/Organizms/admin/users/UsersAdmin'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/Login/LoginUsernameForm'
import PageHeader from 'components/Atoms/Containers/PageHeader'

const Page = () => {
  const userController = useUserController()
  const [loading, setLoading] = React.useState(true)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(userController.authProfile)

  const [selectedTab, setSelectedTab] = React.useState('Jobs')
  const router = useRouter()

  const tabs: TabInfo[] = [{ title: 'Jobs', selected: true }, { title: 'Server' }, { title: 'Api' }, { title: 'Users' }, { title: 'Login Test' }]

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
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController.ticket])

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  const handleValidateUser = async (submitData: UsernameLogin) => {
    const result = await validateUserCSR(submitData.username, submitData.password)
    console.log(result)
  }

  return (
    <>
      <Seo pageTitle='Admin' />
      <ResponsiveContainer>
        <RequireClaim claimType='rs-admin'>
          {loading ? (
            <BackdropLoader />
          ) : userProfile ? (
            <>
              <PageHeader text='Admin' />
              <RequireClaim claimType='qln'>
                <>
                  <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
                  {selectedTab === 'Jobs' && <JobsLayout />}
                  {selectedTab === 'Api' && <ApiTest />}
                  {selectedTab === 'Server' && <ServerInfo />}
                  {selectedTab === 'Users' && <UsersAdmin userProfile={userProfile} />}
                  {selectedTab === 'Login Test' && <LoginUsernameForm title='Sin in' onSubmitted={handleValidateUser} />}
                </>
              </RequireClaim>
            </>
          ) : (
            <PleaseLogin />
          )}
        </RequireClaim>
      </ResponsiveContainer>
    </>
  )
}

export default Page
