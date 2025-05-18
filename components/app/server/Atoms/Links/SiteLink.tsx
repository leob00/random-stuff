'use client'
import { Link, Typography, TypographyVariant } from '@mui/material'
import { useRouter } from 'next/navigation'
import NLink from 'next/link'

const SiteLink = ({ text, href, variant = 'caption' }: { text: string; href: string; variant?: TypographyVariant }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <Link href={href} component={NLink} style={{ fontSize: 'small' }}>
      <Typography variant={variant ?? 'caption'}>{text}</Typography>
    </Link>
  )
}

export default SiteLink
