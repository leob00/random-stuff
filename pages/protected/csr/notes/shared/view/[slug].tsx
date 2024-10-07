import HtmlView from 'components/Atoms/Boxes/HtmlView'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getRecord } from 'lib/backend/csr/nextApiWrapper'
import { weakDecrypt } from 'lib/backend/encryption/useEncryptor'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Page = () => {
  const router = useRouter()
  const slug = router.query.slug as string | undefined
  const encId = decodeURIComponent(slug ?? '')
  const id = weakDecrypt(encId)

  const searchParams = useSearchParams()
  const linkId = searchParams?.get('id') ?? ''
  const decryptedId = weakDecrypt(decodeURIComponent(linkId))
  const [error, setError] = useState<string | null>(null)

  const dataFn = async () => {
    let result: UserNote = {
      body: '',
      title: '',
      dateCreated: '',
      dateModified: '',
    }
    result = (await getRecord<UserNote | null>(id)) ?? result

    if (result.share) {
      if (result.share.viewLink?.token !== decryptedId) {
        setError('Sorry!!! We are unable to find your note note...')
      }
    }

    return result
  }
  const { data, isLoading } = useSwrHelper(id, dataFn, { revalidateOnFocus: false })

  return (
    <>
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          <ResponsiveContainer>
            {error ? (
              <CenterStack>
                <ErrorMessage text={error} />
              </CenterStack>
            ) : (
              <>
                <PageHeader text={data?.title ?? ''} />

                {data && data.body && (
                  <ScrollableBox>
                    <HtmlView html={data.body} textAlign='left' />
                  </ScrollableBox>
                )}
              </>
            )}
          </ResponsiveContainer>
        </>
      )}
    </>
  )
}

export default Page
