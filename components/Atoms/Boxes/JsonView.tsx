import { Box } from '@mui/material'
import { Prettify } from 'lib/util/objects'
import React from 'react'
import CenterStack from '../CenterStack'

const JsonView = ({ obj }: { obj: Prettify<any> | string }) => {
  return (
    <CenterStack sx={{ py: 4 }}>
      <Box maxHeight={300} width={{ xs: 475, sm: 800, md: 1200, lg: 1400 }} sx={{ overflowY: 'auto', overflowX: 'auto' }}>
        <pre>
          <code>{typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2)}</code>
        </pre>
      </Box>
    </CenterStack>
  )
}

export default JsonView
