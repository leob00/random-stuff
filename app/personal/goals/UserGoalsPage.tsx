import UserGoalsLayout from 'components/Organizms/user/goals/UserGoalsLayout'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'

export default async function UserGoalsPage() {
  return (
    <RequireUserProfile>
      <UserGoalsLayout />
    </RequireUserProfile>
  )
}
