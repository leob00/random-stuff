import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import NewsLayout from './NewsLayout'

const NewsLayoutWrapper = ({ suspendLoader = false, revalidateOnFocus = false }: { suspendLoader?: boolean; revalidateOnFocus?: boolean }) => {
  const { userProfile, isValidating: isProfileValidating } = useProfileValidator()
  return (
    <>
      {!isProfileValidating && (
        <>
          <NewsLayout userProfile={userProfile} suspendLoader={suspendLoader} revalidateOnFocus={revalidateOnFocus} />
        </>
      )}
    </>
  )
}

export default NewsLayoutWrapper
