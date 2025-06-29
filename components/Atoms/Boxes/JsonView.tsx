import { Box } from '@mui/material'
import React from 'react'
import CenterStack from '../CenterStack'
import { Prettify } from 'lib/util/tsUtil'

const JsonView = ({ obj }: { obj: Prettify<any> | string }) => {
  return (
    <CenterStack sx={{ py: 4 }}>
      <Box
        maxHeight={300}
        width={{ xs: 475, sm: 800, md: 1200, lg: 1400 }}
        sx={{ overflowY: 'auto', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <pre>
          <code>{typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2)}</code>
        </pre>
      </Box>
    </CenterStack>
  )
}

export default JsonView
