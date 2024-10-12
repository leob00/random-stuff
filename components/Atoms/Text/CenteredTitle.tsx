import { Box, Typography } from '@mui/material'

const CenteredTitle = ({ title, variant = 'h5' }: { title: string; variant?: 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) => {
  return (
    <Box py={1}>
      <Typography variant={variant} sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  )
}

export default CenteredTitle
