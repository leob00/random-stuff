import { Box } from '@mui/material'
import { useUserController } from 'hooks/userController'
import React, { ReactNode } from 'react'

const RequireUserProfile = ({ children }: { children: ReactNode }) => {
  const profile = useUserController().authProfile
  const [showLoginPrompt, setShowLoginPrmpt] = React.useState(profile !== null)

  return <Box>{showLoginPrompt ? <Box>needs profile</Box> : <Box>{children}</Box>} </Box>
}

export default RequireUserProfile
