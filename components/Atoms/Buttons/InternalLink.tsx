import NLink from 'next/link'
import Link from '@mui/material/Link'
import { Typography } from '@mui/material'
import FadeIn from '../Animations/FadeIn'
import { TypographyVariant } from '@mui/material/styles/createTypography'

const InternalLink = ({ route, text, large = false, variant }: { route: string; text: string; large?: boolean; variant?: TypographyVariant }) => {
  return (
    <>
      <FadeIn>
        <NLink href={route} passHref legacyBehavior>
          <Link sx={{ textDecoration: 'none' }} p={1}>
            <Typography textAlign={'center'} variant={`${variant ? variant : large ? 'h3' : 'h6'}`}>
              {text}
            </Typography>
          </Link>
        </NLink>
      </FadeIn>
    </>
  )
}

export default InternalLink
