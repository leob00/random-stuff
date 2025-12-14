import { Stack, Typography } from '@mui/material'

const SummaryTitle = ({ title }: { title: string }) => {
  return (
    <Stack pb={2}>
      <Typography textAlign={'center'} variant='h6'>
        {title}
      </Typography>
    </Stack>
  )
}

export default SummaryTitle
