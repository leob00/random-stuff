import { Box, Stack } from '@mui/material'
import BackButton from 'components/Atoms/Buttons/BackButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DateAndTimePicker from 'components/Atoms/Inputs/DateAndTimePicker'
import DebouncedTextBox from 'components/Atoms/Inputs/DebouncedTextBox'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import EditGoalForm from 'components/Molecules/Forms/EditGoalForm'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { AmplifyUser, getUserCSR } from 'lib/backend/auth/userUtil'
import { myEncryptDefault } from 'lib/backend/encryption/useEncryptor'
import { DropdownItem } from 'lib/models/dropdown'
import { UserGoal } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
import router from 'next/router'

import React from 'react'

const Page = () => {
  const [isLoggedIn, setIsLoggenIn] = React.useState(true)
  const [user, setUser] = React.useState<AmplifyUser | null>(null)
  const [goals, setGoals] = React.useState<UserGoal[]>([])
  const [goalsDDL, setGoalsDDL] = React.useState<DropdownItem[]>([])

  const handleDueDateChange = (value: string) => {
    console.log('date/time: ', value)
  }
  const handleEditGoalSubmit = (data: UserGoal) => {
    console.log(data)
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await getUserCSR()
      setIsLoggenIn(result !== null)
      setUser(result)
      const goalData: UserGoal[] = [
        {
          id: myEncryptDefault(`${user?.email}${getUtcNow().format()}`),
          body: 'default',
          status: 'in progress',
          tasks: [],
        },
      ]
      setGoals(goalData)
      const ddl: DropdownItem[] = goalData.map((g) => {
        return { text: g.body!, value: g.id! }
      })
      setGoalsDDL(ddl)
      console.log(ddl)
    }
    fn()
  }, [])

  return isLoggedIn ? (
    <Box>
      <BackButton
        onClicked={() => {
          router.push('/protected/csr/dashboard')
        }}
      />
      <CenteredTitle title='Tasks' />
      <HorizontalDivider />
      <EditGoalForm goal={{ tasks: [] }} onSubmit={handleEditGoalSubmit} />
    </Box>
  ) : (
    <PleaseLogin />
  )
}

export default Page
