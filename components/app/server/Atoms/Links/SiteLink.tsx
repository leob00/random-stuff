import { Link } from '@mui/material'
import React from 'react'

const SiteLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <Link href={href} style={{ fontSize: 'smaller' }}>
      {text}
    </Link>
  )
}

export default SiteLink
