import { Router } from '@aws-amplify/ui-react/dist/types/components/Authenticator/Router'
import React from 'react'
import LinkButton from './LinkButton'
import router from 'next/router'

const InternalLinkButton = ({ text, route }: { text: string; route?: string }) => {
  const handleClick = () => {
    if (route) {
      router.push(route)
    }
  }
  return <LinkButton onClick={handleClick}>{text}</LinkButton>
}

export default InternalLinkButton
