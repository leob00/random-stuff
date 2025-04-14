import { Box, Typography } from '@mui/material'
import { TypographyVariant } from '@mui/material/styles/createTypography'

const ReadOnlyField = ({
  label,
  val,
  labelLength,
  variant,
  py = 1,
}: {
  label?: string
  val?: string | null | number
  labelLength?: number
  variant?: TypographyVariant
  py?: number
}) => {
  return (
    <Box>
      <Box display={'flex'} flexDirection={'row'} gap={2} py={py}>
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
