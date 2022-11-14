import React from 'react'
import NLink from 'next/link'
import Link from '@mui/material/Link'
import { Stack } from '@mui/material'
import RollingLinearProgress from '../Loaders/RollingLinearProgress'

const InternalLink = ({ route, text }: { route: string; text: string }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <>
      {isLoading ? (
        <RollingLinearProgress width={48} height={32} />
      ) : (
        <NLink href={route} passHref legacyBehavior>
          <Link
            color='secondary'
            fontSize={'1.1rem'}
            fontWeight={700}
            sx={{ textDecoration: 'none' }}
            p={1}
            onClick={() => {
              setIsLoading(true)
            }}
          >
            {text}
          </Link>
        </NLink>
      )}
    </>
  )
}

export default InternalLink
