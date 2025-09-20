import { Box, Typography } from '@mui/material'
import { TypographyVariant } from '@mui/material/styles/createTypography'
import { useViewPortSize } from 'hooks/ui/useViewportSize'

const ReadOnlyField = ({
  label,
  val,
  labelLength,
  variant,
  color,
}: {
  label?: string
  val?: string | null | number
  labelLength?: number
  variant?: TypographyVariant
  color?: string
}) => {
  const { viewPortSize } = useViewPortSize()

  return (
    <Box>
      <Box display={'flex'} flexDirection={'row'} gap={1} alignItems={viewPortSize === 'xs' && !!val && val?.toString().length > 20 ? 'flex-start' : 'center'}>
        {label && (
          <Box display={'flex'} textAlign={'right'} minWidth={labelLength ?? undefined}>
            <Typography variant={variant ?? 'body2'} color={color ?? 'primary'}>{`${label}:`}</Typography>
          </Box>
        )}
        {val && (
          <Box>
            <Typography variant={variant ?? 'body2'} color={color ?? 'primary'} sx={{ fontWeight: 'bold' }}>
              {val}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReadOnlyField
