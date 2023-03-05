import { Alert, Box, TextField, Typography } from '@mui/material'
import React from 'react'
import CenterStack from '../CenterStack'

const PinInput = ({ setFocus, onConfirmed }: { setFocus?: boolean; onConfirmed: (text: string) => void }) => {
  const pin1Ref = React.useRef<HTMLInputElement | null>(null)
  const pin2Ref = React.useRef<HTMLInputElement | null>(null)
  const pin3Ref = React.useRef<HTMLInputElement | null>(null)
  const pin4Ref = React.useRef<HTMLInputElement | null>(null)
  const [error, setError] = React.useState('')

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const validateEntry = (text: any) => {
    setError('')
    if (isNaN(text)) {
      setError('pin must be all numbers')
      return false
    }
    return true
  }

  const handlePin1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateEntry(e.currentTarget.value)
    if (!valid) {
      pin1Ref.current!.value = ''
      pin1Ref.current!.focus()
    } else {
      pin2Ref.current!.focus()
    }
  }
  const handlePin2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateEntry(e.currentTarget.value)
    if (!valid) {
      pin2Ref.current!.value = ''
    } else {
      pin3Ref.current!.focus()
    }
  }
  const handlePin3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateEntry(e.currentTarget.value)
    if (!valid) {
      pin3Ref.current!.value = ''
    } else {
      pin4Ref.current!.focus()
    }
  }
  const handlePin4Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateEntry(e.currentTarget.value)
    if (!valid) {
      pin4Ref.current!.value = ''
    } else {
      const isValid =
        validateEntry(pin1Ref.current?.value) &&
        validateEntry(pin2Ref.current?.value) &&
        validateEntry(pin3Ref.current?.value) &&
        validateEntry(e.currentTarget.value)
      if (isValid) {
        const pin = `${pin1Ref.current?.value}${pin2Ref.current?.value}${pin3Ref.current?.value}${pin4Ref.current?.value}`
        console.log('pin: ', `${pin}`)
        onConfirmed(pin)
      }
    }
  }
  React.useEffect(() => {
    if (pin1Ref.current && setFocus) {
      pin1Ref.current.focus()
    }
  }, [])
  return (
    <>
      <form>
        <Box>
          <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
            <TextField
              onChange={handlePin1Change}
              inputRef={pin1Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='off'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'off',
              }}
            ></TextField>

            <Typography variant='h5' px={2}>
              -
            </Typography>

            <TextField
              onChange={handlePin2Change}
              inputRef={pin2Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='off'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'off',
              }}
            ></TextField>
            <Typography variant='h5' px={2}>
              -
            </Typography>
            <TextField
              onChange={handlePin3Change}
              inputRef={pin3Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='off'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'off',
              }}
            ></TextField>
            <Typography variant='h5' px={2}>
              -
            </Typography>
            <TextField
              onChange={handlePin4Change}
              inputRef={pin4Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='off'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'off',
              }}
            ></TextField>
          </Box>
        </Box>
        <Box minHeight={10}>
          {error.length > 0 && (
            <Box py={2}>
              <CenterStack>
                <Alert severity='error'>{error}</Alert>
              </CenterStack>
            </Box>
          )}
        </Box>
      </form>
    </>
  )
}

export default PinInput
