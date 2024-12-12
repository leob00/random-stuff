import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import WarmupBox from 'components/Atoms/WarmupBox'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import SendPinLayout from 'components/Organizms/user/profile/SendPinLayout'
import VerifyEmail from 'components/Organizms/user/profile/VerifyEmail'
import { getEmailVerificationStatus } from 'components/Organizms/user/profile/profileHelper'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useUserController } from 'hooks/userController'

const ForgotPin = () => {
  const { isValidating, userProfile: profile } = useProfileValidator()
  const { fetchProfilePassive } = useUserController()

  const key = profile?.username ?? 'unkown'
  const dataFn = async () => {
    let result = profile ? profile : await fetchProfilePassive()
    if (result) {
      if (!result.emailVerified) {
        const verified = await getEmailVerificationStatus(result)
        result = { ...result, emailVerified: verified }
      }
    }
    return result
  }
  const { data, isLoading } = useSwrHelper(key, dataFn, { revalidateOnFocus: !profile?.emailVerified })

  return (
    <ResponsiveContainer>
      <>
        {isValidating ? (
          <WarmupBox text='loading profile...' />
        ) : (
          <>{data && <>{!data.emailVerified ? <VerifyEmail userProfile={data} /> : <SendPinLayout profile={data} />}</>}</>
        )}
      </>
    </ResponsiveContainer>
  )
}

export default ForgotPin
