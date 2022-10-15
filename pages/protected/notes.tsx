import { Divider } from '@aws-amplify/ui-react'
import { Box, Button, Container, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { getLoggedinUserCSR } from 'lib/backend/auth/userUtil'
import React from 'react'

const Notes = () => {
  const [loggedIn, setIsLoggedIn] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)
  React.useEffect(() => {
    let fn = async () => {
      let user = await getLoggedinUserCSR()
      if (user) {
        let noteKey = constructUserNotePrimaryKey(user.email)
        console.log('note key: ', noteKey)
      } else {
        console.log('not logged in')
      }
      setIsLoading(false)
      setIsLoggedIn(user !== null)
    }
    fn()
  }, [])
  return (
    <Container>
      {!loggedIn ? (
        <PleaseLogin />
      ) : (
        <>
          <CenterStack>
            <CenteredTitle title={'My Notes'}></CenteredTitle>
          </CenterStack>
          {isLoading && <LargeSpinner />}
          <CenterStack sx={{ py: 2 }}>
            <Button color='secondary' size='small' variant='contained' onClick={() => {}}>
              {'add note'}
            </Button>
          </CenterStack>
          <Divider />
        </>
      )}
    </Container>
  )
}

export default Notes
