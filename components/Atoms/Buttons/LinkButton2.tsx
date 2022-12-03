import { Link } from '@mui/material'
import React, { ReactNode } from 'react'

const LinkButton2 = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
  return (
    <Link component='button' variant='body2' color={'secondary'} onClick={onClick}>
      {children}
    </Link>
  )
}

export default LinkButton2
