import { Typography } from '@mui/material'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import SingleGoalLayout from './SingleGoalLayout'

export default function SingleGoalPage({ id }: { id: string }) {
  const goalId = weakDecrypt(decodeURIComponent(id))
  return (
    <>
      <RequireUserProfile>
        <SingleGoalLayout goalId={goalId} />
      </RequireUserProfile>
    </>
  )
}
