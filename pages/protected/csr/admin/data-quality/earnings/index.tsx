import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import AdminEarningsWrapper from 'components/Organizms/admin/data-quality/earnings/AdminEarningsWrapper'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import useQlnAdmin from 'hooks/auth/useQlnAdmin'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'

const Page = () => {
  const { claim: adminClaim, isValidating: isValidatingAdmin } = useQlnAdmin()
  const { saveClaims } = useSessionStore()
  const handleQlnLogin = (claims: Claim[]) => {
    saveClaims(claims)
  }

  return (
    <ResponsiveContainer>
      {isValidatingAdmin && <BackdropLoader />}
      {!isValidatingAdmin && adminClaim ? (
        <RequireClaim claimType='rs-admin'>
          <Box minHeight={500}>
            <PageHeader text='Data Quality - Earnings' />
            <AdminEarningsWrapper />
          </Box>
        </RequireClaim>
      ) : (
        <>
          <QlnUsernameLoginForm onSuccess={handleQlnLogin} />
        </>
      )}
    </ResponsiveContainer>
  )
}

export default Page
