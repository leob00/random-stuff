'use client'
import NLink from 'next/link'
import { Link, Typography } from '@mui/material'
import FadeIn from '../Animations/FadeIn'
import { TypographyVariant } from '@mui/material/styles/createTypography'

const InternalLink = ({ route, text, large = false, variant }: { route: string; text: string; large?: boolean; variant?: TypographyVariant }) => {
  return (
    <>
      <FadeIn>
        <Link component={NLink} href={route} sx={{ textDecoration: 'none' }} p={1}>
          <Typography textAlign={'center'} variant={`${variant ? variant : large ? 'h3' : 'h6'}`}>
            {text}
          </Typography>
        </Link>
      </FadeIn>
    </>
  )
}

export default InternalLink
