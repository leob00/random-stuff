import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import NavigationButton from './NavigationButton'
import NLink from 'next/link'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/LoginUsernameForm'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'

const TabList = () => {
  const config = apiConnection().qln
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event.currentTarget.nodeValue)
    setValue(newValue)
  }
  const handleSubmitLogin = async (data: UsernameLogin) => {
    const url = `${config.url}/AuthenticateUsernamePassword`
    const response = (await get(url, data)) as QlnApiResponse
    if (response.Errors.length === 0) {
      console.log(response.Body)
    } else {
      console.log(response.Errors[0])
    }

    //console.log(data)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box
      // sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' sx={{ backgroundColor: 'transparent' }}>
          <Tab label='Page router' sx={{ backgroundColor: 'black', color: 'white' }} />
          <Tab label='Login Form' sx={{ backgroundColor: 'black', color: 'white' }} />
          <Tab label='Item Three' sx={{ backgroundColor: 'black', color: 'white' }} />
        </Tabs>
      </Box>
      <Box p={2}>
        {value === 0 && (
          <Box>
            <NLink href='/status'>status</NLink>
          </Box>
        )}
        {value === 1 && (
          <Box>
            <LoginUsernameForm obj={{ username: '', password: '' }} onSubmitted={handleSubmitLogin} title={'QLN Login'} />
          </Box>
        )}
        {value === 2 && <Box>tab 3</Box>}
      </Box>
    </Box>
  )
}

export default TabList
