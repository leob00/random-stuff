import { Box, Link, Typography } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CopyableText from 'components/Atoms/Text/CopyableText'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserNote } from 'lib/backend/api/aws/models/apiGatewayModels'
import { constructUserNoteCategoryKey } from 'lib/backend/api/aws/util'
import { getDynamoItemData, putUserNote } from 'lib/backend/csr/nextApiWrapper'
import { getGuid, weakDecrypt, weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { mutate } from 'swr'

const Page = () => {
  const router = useRouter()
  const slug = router.query.slug as string | undefined
  const encId = decodeURIComponent(slug ?? '')
  const id = weakDecrypt(encId)
  const backRoute = `/protected/csr/notes/${encodeURIComponent(weakEncrypt(id))}`
  const [error, setError] = useState<string | null>(null)
  const { userProfile, isValidating } = useProfileValidator()
  const [showConfirmDeleteViewLink, setShowConfirmDeleteViewLink] = useState(false)

  const dataFn = async () => {
    const result = await getDynamoItemData<UserNote | null>(id)
    if (!result) {
      setError('Sorry!!! We are unable to find your note note...')
    }
    if (result && !result.share) {
      result.share = {}
    }
    return result
  }
  const { data, isLoading } = useSwrHelper(encId, dataFn, { revalidateOnFocus: false })

  const handleGenerateViewLink = () => {
    const token = getGuid()
    const linkId = encodeURIComponent(weakEncrypt(token))
    const noteIdArgs = `${encodeURIComponent(weakEncrypt(id))}`
    const url = `https://random-stuff-seven.vercel.app/protected/csr/notes/shared/view/${noteIdArgs}?id=${linkId}`
    const newNote = { ...data! }
    newNote.share = { ...newNote.share, viewLink: { url: url, token: token } }
    putUserNote(newNote, constructUserNoteCategoryKey(userProfile!.username))
    mutate(encId, newNote, { revalidate: false })
  }

  const handleDeleteViewLink = () => {
    const newNote = { ...data! }
    newNote.share = { ...newNote.share, viewLink: undefined }
    putUserNote(newNote, constructUserNoteCategoryKey(userProfile!.username))
    mutate(encId, newNote, { revalidate: false })
    setShowConfirmDeleteViewLink(false)
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      <ResponsiveContainer>
        <PageHeader text={data?.title ?? ''} backButtonRoute={backRoute} forceShowBackButton />
        {error && (
          <CenterStack>
            <ErrorMessage text={error} />
          </CenterStack>
        )}
        {!userProfile && !isValidating && (
          <CenterStack>
            <ErrorMessage text='failed validating user' />
          </CenterStack>
        )}
        <ScrollableBox>
          {data && data.share && (
            <>
              <Box>
                {data.share.viewLink ? (
                  <Box display={'flex'} flexDirection={'column'} gap={4}>
                    <Box display={'flex'} alignItems={'center'} gap={2}>
                      <CopyableText label='copy view link:' value={data.share.viewLink.url} />
                    </Box>
                    <Box>
                      <Link href={`mailto:name@email.com?subject=Random%20Stuff%20Shared%20Link&body=${encodeURIComponent(data.share.viewLink.url)}`}>
                        email
                      </Link>
                    </Box>
                    <Box>
                      <DangerButton text='delete' size='small' onClick={() => setShowConfirmDeleteViewLink(true)} />
                    </Box>
                  </Box>
                ) : (
                  <Box display={'flex'} alignItems={'center'} gap={2}>
                    <Typography>view link: </Typography>
                    <PrimaryButton size='small' text='generate' onClick={handleGenerateViewLink} />
                  </Box>
                )}
              </Box>
            </>
          )}
        </ScrollableBox>
      </ResponsiveContainer>
      {showConfirmDeleteViewLink && (
        <ConfirmDeleteDialog
          show={showConfirmDeleteViewLink}
          text='Are you surre you want to delete this shareable view link? Nobody will be able to access it ever again.'
          onCancel={() => setShowConfirmDeleteViewLink(false)}
          onConfirm={handleDeleteViewLink}
        />
      )}
    </>
  )
}

export default Page
