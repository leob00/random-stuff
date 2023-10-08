import { Button } from '@aws-amplify/ui-react'
import { Alert, Box, Link, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import WarmupBox from 'components/Atoms/WarmupBox'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import { post, postDelete } from 'lib/backend/api/fetchFunctions'
import numeral from 'numeral'
import React from 'react'
import FileMenu from './FileMenu'

const S3FilesTable = ({
  data,
  readOnly = false,
  onMutated,
  onDeleted,
}: {
  data: S3Object[]
  readOnly?: boolean
  onMutated?: () => void
  onDeleted?: (item: S3Object) => void
}) => {
  const [itemToDelete, setItemToDelete] = React.useState<S3Object | null>(null)
  const [signedUrl, setSignedUrl] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<S3Object | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const signedUrlRef = React.useRef<HTMLAnchorElement | null>(null)
  const handleView = async (item: S3Object) => {
    setIsLoading(true)
    const params = { bucket: item.bucket, prefix: item.prefix, filename: item.filename, expiration: 60 }
    const url = JSON.parse(await post(`/api/s3`, params)) as string
    setSignedUrl(url)
    setSelectedItem(item)
    setIsLoading(false)
    // if (signedUrlRef.current) {
    //   signedUrlRef.current.click()
    // }
    // const a = document.createElement('a')
    // a.setAttribute('href', url)
    // a.setAttribute('target', '_blank')
    // a.click()
    // Object.assign(document.createElement('a'), {
    //   target: '_blank',
    //   rel: 'noopener noreferrer',
    //   href: resp,
    // }).click()
  }
  const handleDelete = async (item: S3Object) => {
    setSignedUrl(null)
    setItemToDelete(item)
  }
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await postDelete('/api/s3', itemToDelete)
      onDeleted?.(itemToDelete)
    }
    setItemToDelete(null)
    onMutated?.()
  }

  return (
    <>
      {isLoading && <WarmupBox text='generating a secure link...' />}
      {data.map((item) => (
        <Box key={item.filename}>
          <Box py={1}>
            <ListItemContainer>
              <Box px={1} py={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                  <Box>
                    <Typography>{item.filename}</Typography>
                  </Box>
                  <Box>{item.size && <Typography>{`size: ${numeral(item.size / 1024 / 1024).format('###,###.00')} MB`}</Typography>}</Box>
                </Box>
                <Box>
                  <FileMenu item={item} onView={handleView} onDelete={handleDelete} />
                </Box>
              </Box>
            </ListItemContainer>
          </Box>
        </Box>
      ))}
      <>{data.length === 0 && <NoDataFound />}</>
      {itemToDelete && (
        <ConfirmDeleteDialog
          show={true}
          text={`Are you sure you want to delete ${itemToDelete.filename}?`}
          onCancel={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {signedUrl && (
        <FormDialog
          title='View file'
          show={true}
          onCancel={() => {
            setSelectedItem(null)
            setSignedUrl(null)
          }}
        >
          <>
            <Stack>
              <Box py={2}>
                <Alert color='warning'>
                  <Typography variant='caption' textAlign={'center'}>
                    This secure link will expire in a few minutes.
                  </Typography>
                </Alert>
              </Box>

              <CenterStack>
                <Typography textAlign={'center'}>{selectedItem?.filename}</Typography>
              </CenterStack>
            </Stack>
            <CenterStack sx={{ pt: 2 }}>
              <Link rel='noreferrer' ref={signedUrlRef} href={signedUrl} target={'_blank'}>
                <PrimaryButton text={'view file'} onClick={() => setSignedUrl(null)}></PrimaryButton>
              </Link>
            </CenterStack>
          </>
        </FormDialog>
      )}
    </>
  )
}

export default S3FilesTable
