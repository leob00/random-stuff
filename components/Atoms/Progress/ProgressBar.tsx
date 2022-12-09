import { LinearProgress } from '@mui/material'
import React from 'react'
import DefaultTooltip from '../Tooltips/DefaultTooltip'

const ProgressBar = ({ value, height = 10, width = 100, toolTipText }: { value: number; height?: number; width?: number; toolTipText?: string }) => {
  return (
    <>
      {toolTipText ? (
        <DefaultTooltip text={toolTipText}>
          <LinearProgress variant='determinate' value={value} color='secondary' sx={{ width: width, height: height, borderRadius: '4rem' }} />
        </DefaultTooltip>
      ) : (
        <LinearProgress variant='determinate' value={value} color='secondary' sx={{ width: width, height: height, borderRadius: '4rem' }} />
      )}
    </>
  )
}

export default ProgressBar
