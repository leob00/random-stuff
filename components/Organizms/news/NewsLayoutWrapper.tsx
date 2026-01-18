'use client'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import NewsLayout from './NewsLayout'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const NewsLayoutWrapper = ({ suspendLoader = false, revalidateOnFocus = false }: { suspendLoader?: boolean; revalidateOnFocus?: boolean }) => {
  const { userProfile, isValidating: isProfileValidating } = useProfileValidator()
  return (
    <>
      {isProfileValidating && <ComponentLoader />}
      {!isProfileValidating && (
        <>
          <NewsLayout userProfile={userProfile} suspendLoader={suspendLoader} revalidateOnFocus={revalidateOnFocus} />
        </>
      )}
    </>
  )
}

export default NewsLayoutWrapper
