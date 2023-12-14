import { LinearProgress } from '@mui/material'
import React from 'react'
import DefaultTooltip from '../Tooltips/DefaultTooltip'

type colors = 'success' | 'secondary' | 'info' | 'primary'

const getProgressColor = (val: number): colors => {
  if (val === 0) {
    return 'secondary'
  }
  if (val > 50) {
    return 'success'
  }
  if (val == 100) {
    return 'success'
  }
  return 'info'
}

const ProgressBar = ({ value, height = 10, width = 100, toolTipText }: { value: number; height?: number; width?: number; toolTipText?: string }) => {
  return (
    <>
      {toolTipText ? (
        <DefaultTooltip text={toolTipText} color={getProgressColor(value)}>
          <LinearProgress variant='determinate' value={value} color={getProgressColor(value)} sx={{ width: width, height: height, borderRadius: '4rem' }} />
        </DefaultTooltip>
      ) : (
        <LinearProgress variant='determinate' value={value} color={getProgressColor(value)} sx={{ width: width, height: height, borderRadius: '4rem' }} />
      )}
    </>
  )
}

export default ProgressBar
