import PleaseLogin from 'components/Molecules/PleaseLogin'
import { useUserController } from 'hooks/userController'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { Claim, getUserCSR, userHasRole, validateUserCSR } from 'lib/backend/auth/userUtil'
import { useRouter } from 'next/router'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import JobsLayout from 'components/Organizms/admin/JobsLayout'
import Seo from 'components/Organizms/Seo'
import ApiTest from 'components/Organizms/admin/ApiTest'
import TabList from 'components/Atoms/Buttons/TabList'
import ServerInfo from 'components/Organizms/admin/ServerInfo'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UsersAdmin from 'components/Organizms/admin/users/UsersAdmin'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import DataQualityStart from 'components/Organizms/admin/data-quality/DataQualityStart'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import useQlnAdmin from 'hooks/auth/useQlnAdmin'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useState } from 'react'
import ApiStream from 'components/Organizms/admin/stream/ApiStream'

const Page = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const [selectedTab, setSelectedTab] = useState('Jobs')
  const { saveClaims } = useSessionStore()
  const tabs: TabInfo[] = [{ title: 'Jobs', selected: true }, { title: 'Server' }, { title: 'Api Stream' }, { title: 'Users' }, { title: 'Data Quality' }]

  const { claim: adminClaim, isValidating: isValidatingAdmin } = useQlnAdmin()

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  const handleQlnLogin = (claims: Claim[]) => {
    saveClaims(claims)
  }
  return (
    <>
      <Seo pageTitle='Admin' />
      <ResponsiveContainer>
        <PageHeader text='Admin' />
        <RequireClaim claimType='rs-admin'>
          {isValidatingProfile || (isValidatingAdmin && <BackdropLoader />)}
          {!isValidatingAdmin && !!adminClaim && (
            <>
              <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
              {selectedTab === 'Jobs' && <JobsLayout userClaim={adminClaim} />}
              {selectedTab === 'Server' && <ServerInfo />}
              {selectedTab === 'Api Stream' && <ApiStream />}
              {selectedTab === 'Users' && <>{userProfile && <UsersAdmin userProfile={userProfile} />}</>}
              {selectedTab === 'Data Quality' && <DataQualityStart />}
            </>
          )}
        </RequireClaim>

        <>{!isValidatingAdmin && !adminClaim && <QlnUsernameLoginForm onSuccess={handleQlnLogin} />}</>
      </ResponsiveContainer>
    </>
  )
}

export default Page
