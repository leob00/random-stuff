import { Authenticator } from '@aws-amplify/ui-react'
import React from 'react'
import styled from '@emotion/styled'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
type AuthMode = 'signIn' | 'signUp' | 'resetPassword'
const LoginLayout = () => {
  const [mode, setMode] = React.useState<AuthMode>('signIn')

  return <Authenticator variation='default' initialState={mode} />
}
export default LoginLayout
