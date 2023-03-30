import React from 'react'
import NLink from 'next/link'
import Link from '@mui/material/Link'
import { Typography } from '@mui/material'
import RollingLinearProgress from '../Loaders/RollingLinearProgress'

const InternalLink = ({ route, text, large = false }: { route: string; text: string; large?: boolean }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <>
      {isLoading ? (
        <RollingLinearProgress width={48} height={48} />
      ) : (
        <NLink href={route} passHref legacyBehavior>
          <Link
            color='secondary'
            sx={{ textDecoration: 'none' }}
            p={1}
            onClick={() => {
              setIsLoading(true)
            }}
          >
            <Typography textAlign={'center'} variant={`${large ? 'h4' : 'h5'}`}>
              {text}
            </Typography>
          </Link>
        </NLink>
      )}
    </>
  )
}

export default InternalLink
