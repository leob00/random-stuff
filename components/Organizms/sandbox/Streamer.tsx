import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import React from 'react'

const Streamer = () => {
  const handleClick = async () => {
    const url = '/api/experiment/stream'
    fetch(url).then((resp) => {
      resp.text().then((val) => {
        console.log(val)
      })
    })

    //const reader = resp.body?.getReader()
  }
  return (
    <>
      <Box py={2}>
        <PrimaryButton text='start' onClick={handleClick} />
      </Box>
    </>
  )
}

export default Streamer
