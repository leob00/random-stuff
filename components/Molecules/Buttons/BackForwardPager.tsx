import { Box, Typography } from '@mui/material'
import ArrowLeftButton from 'components/Atoms/Buttons/ArrowLeftButton'
import ArrowRightButton from 'components/Atoms/Buttons/ArrowRightButton'

const BackForwardPager = ({
  backButtonDisabled,
  middleText,
  nextButtonDisabled,
  handleBackClick,
  handleNextClick,
}: {
  backButtonDisabled: boolean
  middleText: string
  nextButtonDisabled: boolean
  handleBackClick: () => void
  handleNextClick: () => void
}) => {
  return (
    <Box py={2} display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'}>
      <ArrowLeftButton disabled={backButtonDisabled} onClicked={handleBackClick} />
      <Typography variant='caption'>{middleText}</Typography>
      <ArrowRightButton disabled={nextButtonDisabled} onClicked={handleNextClick} />
    </Box>
  )
}

export default BackForwardPager
