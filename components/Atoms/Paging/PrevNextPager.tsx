import { Box, Typography } from '@mui/material'
import ArrowLeftButton from '../Buttons/ArrowLeftButton'
import ArrowRightButton from '../Buttons/ArrowRightButton'

const PrevNextPager = ({
  itemCount,
  selectedIndex,
  handlePrevClick,
  handleNextClick,
}: {
  itemCount: number
  selectedIndex: number
  handlePrevClick: () => void
  handleNextClick: () => void
}) => {
  return (
    <Box display={'flex'} justifyContent={'center'} gap={4} alignItems={'center'}>
      <ArrowLeftButton onClicked={handlePrevClick} disabled={selectedIndex <= 0} />

      {/* <Typography variant='caption'>{`${selectedIndex + 1}`}</Typography>
      <Typography variant='caption'>{`-`}</Typography>
      <Typography variant='caption'>{`${itemCount}`}</Typography> */}
      <ArrowRightButton onClicked={handleNextClick} disabled={selectedIndex === itemCount - 1} />
    </Box>
  )
}

export default PrevNextPager
