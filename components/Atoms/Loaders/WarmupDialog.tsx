import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import React from 'react'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import WarmupBox from '../WarmupBox'

const WarmupDialog = ({ text, show }: { text?: string; show: boolean }) => {
  return (
    <Dialog open={show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
      <DialogContent>
        <WarmupBox text={text} />
        <DialogContentText id='alert-dialog-description' sx={{ pt: 3 }} color='primary' variant='subtitle1'></DialogContentText>
      </DialogContent>
      <HorizontalDivider />
    </Dialog>
  )
}

export default WarmupDialog
