import { Box, Typography, useTheme } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

const ReadOnlyField = ({ label, val, labelLength, variant }: { label?: string; val?: string | null | number; labelLength?: number; variant?: Variant }) => {
  const theme = useTheme()
  return (
    <Box>
      <Box display={'flex'} flexDirection={'row'} gap={2} py={1}>
        {label && (
          <Box textAlign={'right'} minWidth={labelLength ?? undefined}>
            <Typography variant={variant ?? 'body2'} color={'primary'}>{`${label}:`}</Typography>
          </Box>
        )}
        {val && (
          <Box>
            <Typography variant={variant ?? 'body2'} color={'primary'}>
              {val}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReadOnlyField
