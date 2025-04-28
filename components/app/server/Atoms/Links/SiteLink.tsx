'use client'
import { Link } from '@mui/material'

const SiteLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <Link href={href} style={{ fontSize: 'small' }}>
      {text}
    </Link>
  )
}

export default SiteLink
