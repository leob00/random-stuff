import { Box, Typography } from '@mui/material'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'

const CenteredHeader = ({
  title,
  description,
  variant = 'h4',
}: {
  title: string
  description?: string
  variant?: 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) => {
  return (
    <Box>
      <CenteredTitle title={title} variant={variant} />
      {description && (
        <Typography color='primary' variant='body1' sx={{ textAlign: 'center', paddingBottom: 2 }}>
          {`${description}`}
        </Typography>
      )}
    </Box>
  )
}

export default CenteredHeader
