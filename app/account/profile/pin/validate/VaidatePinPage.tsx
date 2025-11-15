import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import PinEntry from './PinEntry'

export const dynamic = 'force-dynamic' // disable cache
export default async function Page() {
  return (
    <Box>
      <CenterStack>
        <Typography>Validate Pin</Typography>
      </CenterStack>

      <PinEntry />
    </Box>
  )
}
