import { Box, Typography } from '@mui/material'
import { TypographyVariant } from '@mui/material/styles/createTypography'
import { useViewPortSize } from 'hooks/ui/useViewportSize'

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
  const { viewPortSize } = useViewPortSize()

  return (
    <Box>
      <Box
        display={'flex'}
        flexDirection={'row'}
        gap={2}
        py={py}
        alignItems={viewPortSize === 'xs' && !!val && val?.toString().length > 20 ? 'flex-start' : 'center'}
      >
        {label && (
          <Box textAlign={'right'} minWidth={labelLength ?? undefined}>
            <Typography variant={variant ?? 'body2'} color={'primary'}>{`${label}:`}</Typography>
          </Box>
        )}
        {val && (
          <Box>
            <Typography variant={variant ?? 'body1'} color={'primary'}>
              {val}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReadOnlyField
