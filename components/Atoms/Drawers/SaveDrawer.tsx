import { Box, Drawer } from '@mui/material'
import SuccessButton from '../Buttons/SuccessButton'

const SaveDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} anchor='bottom'>
      <Box py={2} display={'flex'} gap={2} justifyContent={'center'}>
        <SuccessButton text='save' />
      </Box>
    </Drawer>
  )
}

export default SaveDrawer
