import React from 'react'
import NLink from 'next/link'
import Link from '@mui/material/Link'
import { Box, LinearProgress, Stack } from '@mui/material'

const InternalLink = ({ route, text }: { route: string; text: string }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <>
      {isLoading ? (
        <Stack minWidth={48} alignContent='center' justifyContent={'center'} minHeight={32}>
          <LinearProgress color='secondary' />
        </Stack>
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
