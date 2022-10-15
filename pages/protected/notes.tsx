import { Divider } from '@aws-amplify/ui-react'
import { Box, Button, Container, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import dayjs from 'dayjs'
import { LambdaBody, LambdaDynamoRequest, LambdaListResponse, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { axiosGet } from 'lib/backend/api/aws/useAxios'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { axiosPut } from 'lib/backend/api/qln/useAxios'
import { getLoggedinUserCSR } from 'lib/backend/auth/userUtil'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const Notes = () => {
  const [loggedIn, setIsLoggedIn] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reload, setReload] = React.useState(true)
  const [allNotes, setAllNotes] = React.useState<UserNote[]>([])

  const loadData = async () => {
    let user = await getLoggedinUserCSR()
    if (user !== null) {
      let primaryKey = constructUserNotePrimaryKey(user.email)
      let categoryKey = constructUserNoteCategoryKey(user.email)

      let response = (await axiosGet(`/api/searchRandomStuff?id=${categoryKey}`)) as LambdaBody[]
      //s console.log(response)
      let notes: UserNote[] = response.map((item) => JSON.parse(item.data))

      if (notes.length === 0) {
        let sample1: UserNote = {
          id: primaryKey,
          title: 'Shopping List',
          body: '',
          dateCreated: dayjs().format(),
          dateModified: '',
        }
        let req: LambdaDynamoRequest = {
          id: sample1.id,
          category: categoryKey,
          data: sample1,
        }
        let notes: UserNote[] = [sample1]
        setAllNotes(notes)
        console.log('adding sample notes')
        await axiosPut(`/api/putRandomStuff`, req)
      } else {
        setAllNotes(notes)
      }
    } else {
      console.log('not logged in')
    }
    setIsLoading(false)
    setIsLoggedIn(user !== null)
    setReload(false)
  }

  React.useEffect(() => {
    let fn = async () => {
      await loadData()
    }
    if (reload) {
      fn()
    }
  }, [reload])
  return (
    <Container>
      {!loggedIn ? (
        <PleaseLogin />
      ) : (
        <>
          <CenterStack>
            <CenteredTitle title={'My Notes'}></CenteredTitle>
          </CenterStack>
          {isLoading ? (
            <LargeSpinner />
          ) : (
            <>
              <CenterStack sx={{ py: 2 }}>
                <Button color='secondary' size='small' variant='contained' onClick={() => {}}>
                  {'add note'}
                </Button>
              </CenterStack>
              <Divider />
              <CenterStack sx={{ py: 2 }}>
                {allNotes.map((item) => (
                  <Box key={item.id}>
                    <InternalLinkButton text={item.title} route='/' />
                  </Box>
                ))}
              </CenterStack>
            </>
          )}
        </>
      )}
    </Container>
  )
}

export default Notes
