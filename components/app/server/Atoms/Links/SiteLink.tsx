'use client'
import { Link } from '@mui/material'
import { useRouter } from 'next/navigation'
import NLink from 'next/link'

const SiteLink = ({ text, href }: { text: string; href: string }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <Link href={href} component={NLink} style={{ fontSize: 'small' }}>
      {text}
    </Link>
  )
}

export default SiteLink
