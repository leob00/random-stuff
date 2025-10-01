import { Box, Typography } from '@mui/material'

const KeyValueList = ({ map }: { map: Map<string, string> }) => {
  return (
    <Box display={'flex'} gap={1}>
      <Box flexDirection={'column'}>
        {Array.from(map.keys()).map((field) => (
          <Box key={field} flexDirection={'column'} py={0.3}>
            {field && <Typography variant='body2' textAlign={'right'}>{`${field}:`}</Typography>}
          </Box>
        ))}
      </Box>
      <Box flexDirection={'column'}>
        {Array.from(map.values()).map((field, ix) => (
          <Box key={ix} flexDirection={'column'} py={0.3}>
            {field && <Typography variant='body2' textAlign={'left'} fontWeight={'bold'}>{`${field}`}</Typography>}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default KeyValueList
