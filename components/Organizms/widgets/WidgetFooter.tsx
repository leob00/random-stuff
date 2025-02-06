import { Box, Button, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useRouter } from 'next/navigation'

const WidgetFooter = ({ detailsUrl }: { detailsUrl?: string }) => {
  const router = useRouter()
  const handleDetailsClick = () => {
    if (detailsUrl) {
      router.push(detailsUrl)
    }
  }
  return (
    <>
      {!!detailsUrl && (
        <Box>
          <HorizontalDivider />
          <Box py={1} px={2}>
            <Button variant='text' onClick={handleDetailsClick}>
              <Typography variant={'body2'}>details &raquo;</Typography>
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}

export default WidgetFooter
