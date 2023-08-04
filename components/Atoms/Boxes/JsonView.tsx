import { Box } from '@mui/material'
import React from 'react'
import CenterStack from '../CenterStack'

const JsonView = ({ obj }: { obj: object | string }) => {
  return (
    <CenterStack sx={{ py: 4 }}>
      <Box maxHeight={300} sx={{ overflowY: 'auto', overflowX: 'auto' }}>
        <pre>
          <code>{typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2)}</code>
        </pre>
      </Box>
    </CenterStack>
  )
}

export default JsonView
