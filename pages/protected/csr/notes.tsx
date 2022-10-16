import { Divider } from '@aws-amplify/ui-react'
import { Box, Button, Container, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import InternalLinkButton from 'components/Atoms/Buttons/InternalLinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import LargeSpinner from 'components/Atoms/Loaders/LargeSpinner'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import dayjs from 'dayjs'
import { LambdaBody, LambdaDynamoRequest, LambdaListResponse, searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { axiosGet } from 'lib/backend/api/aws/useAxios'
import { constructUserNoteCategoryKey, constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { axiosPut } from 'lib/backend/api/qln/useAxios'
import { getUserCSR } from 'lib/backend/auth/userUtil'
import { getUserNotes, putUserNote } from 'lib/backend/csr/nextApiWrapper'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const Notes = () => {
  const [loggedIn, setIsLoggedIn] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reload, setReload] = React.useState(true)
  const [allNotes, setAllNotes] = React.useState<UserNote[]>([])

  const loadData = async () => {
    let user = await getUserCSR()
    if (user !== null) {
      let notes = await getUserNotes(user.email)
      setAllNotes(notes)
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
  return <Container>{!loggedIn ? <PleaseLogin /> : <UserNotesLayout data={allNotes} isLoading={isLoading} />}</Container>
}

export default Notes
