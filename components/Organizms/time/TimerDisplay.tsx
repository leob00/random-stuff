'use client'

import { Box, Stack, Typography } from '@mui/material'
import CircleProgress from 'components/Atoms/Loaders/CircleProgress'
import { getDuration, getUtcNow, TimeDuration } from 'lib/util/dateUtil'
import { useEffect, useState } from 'react'
import { getDurationText } from './Countdown'
import GlobalAccordion from 'components/Molecules/Accordions/GlobalAccordion'
import TimerForm, { TimerSettingsFilter } from './TimerForm'
import dayjs from 'dayjs'
import { calculatePercent } from 'lib/util/numberUtil'
import { usePolling } from 'hooks/usePolling'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { progress } from 'framer-motion'
import numeral from 'numeral'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
dayjs.extend(isSameOrAfter)

type Model = {
  startDt: string
  endDt: string
  currenDt: string
  duration: TimeDuration
  durationText: string
  progressPerc: number
}

const TimerDisplay = () => {
  const utcNow = getUtcNow().format()
  const [model, setModel] = useState<Model>(getData(utcNow, utcNow, utcNow))
  const [formExapnded, setFormExpanded] = useState(true)

  const { pollCounter, isStopped, stop, start } = usePolling(1000, 1000, true)

  const handleSubmit = (data: TimerSettingsFilter) => {
    const utcNow = getUtcNow()
    const endDt = utcNow
      .add(data.hours ?? 0, 'hours')
      .add(data.minutes ?? 0, 'minutes')
      .add(data.seconds ?? 0, 'seconds')
    const newModel = getData(utcNow.format(), utcNow.format(), endDt.format())
    setModel({ ...newModel, progressPerc: 0 })

    setFormExpanded(false)
    start()
  }

  const handleStop = () => {
    stop()
  }

  useEffect(() => {
    if (!isStopped) {
      const now = getUtcNow()
      const newModel = { ...model }
      const data = getData(newModel.startDt, now.format(), newModel.endDt)
      if (data.duration.totalSeconds <= 0) {
        stop()
        setModel(data)
      } else {
        setModel(data)
      }
    }
  }, [pollCounter])

  return (
    <Box>
      <GlobalAccordion isExpanded={formExapnded} onExpandCollapse={(expanded) => setFormExpanded(expanded)} title='settings'>
        <Box>
          <TimerForm onSubmitted={handleSubmit} />
        </Box>
      </GlobalAccordion>
      <Box display={'flex'} justifyContent={'center'}>
        <Box py={1}>
          <Typography variant='h1' fontWeight={'bold'}>
            {model.durationText}
          </Typography>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'}>
        <CircleProgress progress={model.progressPerc} variant='determinate' size='xl' />
      </Box>
      <Box display={'flex'} justifyContent={'center'} py={2}>
        {model.progressPerc > 0 && model.progressPerc < 99 && <DangerButton text={'stop'} onClicked={handleStop} />}
      </Box>
    </Box>
  )
}

const getData = (startDt: string, currenDt: string, endDt: string) => {
  const spanFromStart = getDuration(startDt, endDt)
  const span = getDuration(currenDt, endDt)
  const secondsFromStartToEnd = spanFromStart.totalSeconds
  const secondsFromCurrentToEnd = span.totalSeconds
  const durationTimeString = getDurationText(span)
  const progress = 100 - calculatePercent(secondsFromCurrentToEnd, secondsFromStartToEnd)
  const duration = getDuration(currenDt, endDt)

  const result: Model = {
    startDt: startDt,
    endDt: endDt,
    currenDt: currenDt,
    duration: duration,
    durationText: durationTimeString,
    progressPerc: Math.ceil(progress),
  }

  return result
}

export default TimerDisplay
