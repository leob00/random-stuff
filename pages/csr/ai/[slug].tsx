import { Box, Typography } from '@mui/material'
import AnthropicChatBot from 'components/ai/anthropic/AnthropicChatBot'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import Seo from 'components/Organizms/Seo'
import { useUserController } from 'hooks/userController'
import { postBody } from 'lib/backend/api/fetchFunctions'
import { AmplifyUser, getUserCSR, Role } from 'lib/backend/auth/userUtil'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()
  const id = router.query.slug as string
  const [isLoading, setIsLoading] = useState(true)

  const { ticket, setTicket } = useUserController()
  const [hasRole, setHasRole] = useState(ticketHasRole(ticket))
  useEffect(() => {
    const fn = async () => {
      if (!ticket) {
        const user = await getUserCSR()
        if (user) {
          setTicket(user)
          setHasRole(ticketHasRole(user))
        }
      }
      setIsLoading(false)
    }
    fn()
  }, [ticket, hasRole])

  const handleActivate = async () => {
    setIsLoading(true)
    if (ticket) {
      const body: Role = {
        Name: 'AnthropicAiChat',
      }
      const result = await postBody('/api/aws/user/activateRole', 'POST', body)
      const data = result as AmplifyUser
      // console.log('result: ', data)
      setTicket(data)
      setHasRole(ticketHasRole(data))
      setIsLoading(false)
    }
  }

  return (
    <>
      <Seo pageTitle={`Chat with AI`} />
      <ResponsiveContainer>
        <PageHeader text={`Chat with AI`} />
        {isLoading && <ComponentLoader pt={20} />}
        {hasRole && !isLoading ? (
          <AnthropicChatBot />
        ) : (
          <Box py={8}>
            <CenterStack>
              <Typography>
                <SuccessButton text='activate' onClick={handleActivate} />
              </Typography>
            </CenterStack>
          </Box>
        )}
      </ResponsiveContainer>
    </>
  )
}

function ticketHasRole(ticket: AmplifyUser | null) {
  if (!ticket) {
    return false
  }

  return ticket.roles?.find((m) => m.Name === 'AnthropicAiChat') ?? false
}

export default Page
