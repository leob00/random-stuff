'use client'
import NLink from 'next/link'
import { Link, Typography } from '@mui/material'
import { TypographyVariant } from '@mui/material/styles/createTypography'

const InternalLink = ({ route, text, large = false, variant }: { route: string; text: string; large?: boolean; variant?: TypographyVariant }) => {
  return (
    <>
      <Link component={NLink} href={route} sx={{ textDecoration: 'none' }} p={1}>
        <Typography textAlign={'center'} variant={`${variant ? variant : large ? 'h3' : 'h6'}`}>
          {text}
        </Typography>
      </Link>
    </>
  )
}

export default InternalLink
