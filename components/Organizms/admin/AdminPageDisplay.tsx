'use client'
import AnthropicChatBot from 'components/ai/anthropic/AnthropicChatBot'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import TabList from 'components/Atoms/Buttons/TabList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import useQlnAdmin from 'hooks/auth/useQlnAdmin'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useState } from 'react'
import RequireClaim from '../user/RequireClaim'
import DataQualityStart from './data-quality/DataQualityStart'
import JobsLayout from './JobsLayout'
import ServerInfo from './ServerInfo'
import UsersAdmin from './users/admin/UsersAdmin'

const AdminPageDisplay = () => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const [selectedTab, setSelectedTab] = useState('Jobs')
  const { saveClaims } = useSessionStore()
  const tabs: TabInfo[] = [{ title: 'Jobs', selected: true }, { title: 'Server' }, { title: 'Users' }, { title: 'Data Quality' }, { title: 'AI' }]

  const { claim: adminClaim, isValidating: isValidatingAdmin } = useQlnAdmin()

  const handleSelectTab = (tab: TabInfo) => {
    setSelectedTab(tab.title)
  }

  const handleQlnLogin = (claims: Claim[]) => {
    saveClaims(claims)
  }
  return (
    <>
      {isValidatingProfile || (isValidatingAdmin && <ComponentLoader />)}
      <RequireClaim claimType='rs-admin'>
        {!isValidatingAdmin && !!adminClaim && (
          <>
            <TabList tabs={tabs} onSetTab={handleSelectTab} selectedTab={tabs.findIndex((m) => m.title === selectedTab)} />
            {selectedTab === 'Jobs' && <JobsLayout userClaim={adminClaim} />}
            {selectedTab === 'Server' && <ServerInfo />}
            {selectedTab === 'Users' && <>{userProfile && <UsersAdmin userProfile={userProfile} />}</>}
            {selectedTab === 'Data Quality' && <DataQualityStart />}
            {selectedTab === 'AI' && <AnthropicChatBot />}
          </>
        )}
      </RequireClaim>

      <>{!isValidatingAdmin && !adminClaim && <QlnUsernameLoginForm onSuccess={handleQlnLogin} />}</>
    </>
  )
}

export default AdminPageDisplay
