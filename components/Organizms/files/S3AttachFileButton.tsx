import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Button, IconButton, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
const S3AttachFileButton = ({ onClicked }: { onClicked: () => void }) => {
  return (
    <CenterStack>
      <IconButton color='primary' size='small' onClick={onClicked}>
        <AttachFileIcon fontSize='small'></AttachFileIcon>
      </IconButton>
      <Button onClick={onClicked}>
        <Typography variant='body2'>attach a file</Typography>
      </Button>
    </CenterStack>
  )
}

export default S3AttachFileButton
