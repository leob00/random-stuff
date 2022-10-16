import { Box, Button, Divider } from '@mui/material'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import { UserNote } from 'lib/models/randomStuffModels'
import router from 'next/router'
import React from 'react'

const UserNotesLayout = ({ data, isLoading }: { data: UserNote[]; isLoading: boolean }) => {
  const handleAddNote = () => {
    router.push(`/protected/csr/note`)
  }
  return (
    <>
      <CenterStack>
        <CenteredTitle title={'My Notes'}></CenteredTitle>
      </CenterStack>
      <Box sx={{ py: 2 }}>
        <Button color='secondary' size='small' variant='contained' onClick={handleAddNote} disabled={isLoading}>
          {'add note'}
        </Button>
      </Box>
      <Divider />
      {isLoading ? (
        <LargeSpinner />
      ) : (
        <CenterStack sx={{ py: 2 }}>
          {data.map((item) => (
            <Box key={item.id}>
              <InternalLinkButton text={item.title} route='/' />
            </Box>
          ))}
        </CenterStack>
      )}
    </>
  )
}

export default UserNotesLayout
