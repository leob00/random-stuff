import { Link } from '@mui/material'
import React from 'react'
import NLink from 'next/link'

const SiteLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <NLink href={href} passHref legacyBehavior>
      <Link href={href} style={{ fontSize: 'smaller' }}>
        {text}
      </Link>
    </NLink>
  )
}

export default SiteLink
