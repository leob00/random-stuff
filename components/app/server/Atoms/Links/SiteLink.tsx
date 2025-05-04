'use client'
import { Link } from '@mui/material'
import { useRouter } from 'next/navigation'

const SiteLink = ({ text, href }: { text: string; href: string }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <Link component='button' style={{ fontSize: 'small' }} onClick={handleClick}>
      {text}
    </Link>
  )
}

export default SiteLink
