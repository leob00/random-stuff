import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { useUserController } from 'hooks/userController'
import useSWR, { Fetcher, preload } from 'swr'
import { Alert, Box, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { BasicArticle } from 'lib/model'
import JsonView from 'components/Atoms/Boxes/JsonView'
import TabList from 'components/Atoms/Buttons/TabList'
import { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import NLink from 'next/link'
import LoginUsernameForm, { UsernameLogin } from 'components/Molecules/Forms/LoginUsernameForm'
import { apiConnection } from 'lib/backend/api/config'
import { QlnApiResponse } from 'lib/backend/api/qln/qlnApi'
import { get } from 'lib/backend/api/fetchFunctions'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import SnackbarError from 'components/Atoms/Dialogs/SnackbarError'

const apiUrl = '/api/edgeRandomAnimals?id=dogs'
const fetcher: Fetcher<BasicArticle[]> = (url: string) => fetch(url).then((res) => res.json())
const config = apiConnection().qln

const Page = () => {
  const ticket = useUserController().ticket

  const tabs: TabInfo[] = [
    {
      title: 'Page Router',
      selected: true,
    },
    {
      title: 'Login Form',
    },
    {
      title: 'Tab 3',
    },
  ]
  const [selectedTab, setSelectedTab] = React.useState(tabs[0].title)
  const [loginError, setLoginError] = React.useState<string | undefined>(undefined)
  const [showLoginSuccess, setShowLoginSuccess] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSetTab = (tab: TabInfo) => {
    //console.log(tab)
    setSelectedTab(tab.title)
  }
  const handleLoginSuccess = (data: UsernameLogin) => {
    setShowLoginSuccess(true)
  }

  const handleSubmitLogin = async (data: UsernameLogin) => {
    setIsLoading(true)
    setShowLoginSuccess(false)
    setLoginError(undefined)
    const url = `${config.url}/AuthenticateUsernamePassword`
    const response = (await get(url, data)) as QlnApiResponse
    if (response.Errors.length === 0) {
      setShowLoginSuccess(true)
    } else {
      //console.log(response.Errors[0])
      setLoginError(response.Errors[0].Message)
    }
    setIsLoading(false)
  }

  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' />
        <TabList tabs={tabs} onSetTab={handleSetTab} />
        <Box p={2}>
          {selectedTab === 'Page Router' && (
            <Box>
              <NLink href='/status'>status</NLink>
            </Box>
          )}
          {selectedTab === 'Login Form' && (
            <Box>
              {isLoading && <BackdropLoader />}
              <LoginUsernameForm obj={{ username: '', password: '' }} onSubmitted={handleSubmitLogin} title={'QLN Login'} error={loginError} />
              {showLoginSuccess && (
                <>
                  <SnackbarSuccess show={showLoginSuccess} text={'Login Successful'} />
                </>
              )}
            </Box>
          )}
          {selectedTab === 'Tab 3' && <Box>tab 3</Box>}
        </Box>
      </ResponsiveContainer>
    </>
  )
}

export default Page
