import { Link, Typography } from '@mui/material'
import React, { ReactNode } from 'react'

const LinkButton2 = ({ children, id, onClick }: { children: ReactNode; id?: string; onClick: () => void }) => {
  return (
    <Link component='button' id={id} color={'secondary'} onClick={onClick}>
      <Typography variant={'body1'}>{children}</Typography>
    </Link>
  )
}

export default LinkButton2
