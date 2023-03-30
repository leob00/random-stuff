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
    if (e.target.value.length > 0) {
      e.target.select()
    }
  }
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isValid =
      validateEntry(pin1Ref.current?.value) &&
      validateEntry(pin2Ref.current?.value) &&
      validateEntry(pin3Ref.current?.value) &&
      validateEntry(e.currentTarget.value)
    if (isValid) {
      const pin = `${pin1Ref.current?.value}${pin2Ref.current?.value}${pin3Ref.current?.value}${pin4Ref.current?.value}`
      onConfirmed(pin)
    } else {
      setError('invalid pin')
      pin1Ref.current!.value = ''
      pin2Ref.current!.value = ''
      pin3Ref.current!.value = ''
      e.currentTarget.defaultValue = ''
      pin1Ref.current!.focus()
    }
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
      e.currentTarget.focus()
    } else {
      if (pin2Ref.current) {
        pin2Ref.current.value = ''
        pin2Ref.current.focus()
      }
    }
  }
  const handlePin2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateEntry(e.currentTarget.value)
    if (!valid) {
      pin2Ref.current!.value = ''
    } else {
      if (pin3Ref.current) {
        pin3Ref.current.value = ''
        pin3Ref.current.focus()
      }
    }
  }
  const handlePin3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valid = validateEntry(e.currentTarget.value)
    if (!valid) {
      pin3Ref.current!.value = ''
      pin3Ref.current!.focus()
    } else {
      if (pin4Ref.current) {
        pin4Ref.current.value = ''
        pin4Ref.current.focus()
      }
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
        onConfirmed(pin)
      } else {
        setError('invalid pin')
        pin1Ref.current!.value = ''
        pin2Ref.current!.value = ''
        pin3Ref.current!.value = ''
        e.currentTarget.defaultValue = ''
        pin1Ref.current!.focus()
      }
    }
  }
  React.useEffect(() => {
    if (pin1Ref.current && setFocus) {
      pin1Ref.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Box>
        <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
          <form onSubmit={handleFormSubmit} autoComplete='off'>
            <TextField
              id={'pin1'}
              onChange={handlePin1Change}
              inputRef={pin1Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='new-password'
              size='small'
              placeholder={''}
              InputProps={{
                //type: 'number',
                autoComplete: 'new-password',
              }}
            ></TextField>
          </form>

          <Typography variant='h5' px={2}>
            -
          </Typography>
          <form onSubmit={handleFormSubmit} autoComplete='off'>
            <TextField
              id={'pin2'}
              onChange={handlePin2Change}
              inputRef={pin2Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='new-password'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'new-password',
              }}
            ></TextField>
          </form>
          <Typography variant='h5' px={2}>
            -
          </Typography>
          <form onSubmit={handleFormSubmit} autoComplete='off'>
            <TextField
              id={'pin3'}
              onChange={handlePin3Change}
              inputRef={pin3Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='new-password'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'new-password',
              }}
            ></TextField>
          </form>
          <Typography variant='h5' px={2}>
            -
          </Typography>
          <form onSubmit={handleFormSubmit} autoComplete='off'>
            <TextField
              id={'pin4'}
              onChange={handlePin4Change}
              inputRef={pin4Ref}
              onFocus={handleFocus}
              sx={{ width: 35 }}
              required
              type='password'
              inputProps={{ maxLength: 1 }}
              variant='outlined'
              autoComplete='new-password'
              size='small'
              placeholder={''}
              InputProps={{
                autoComplete: 'new-password',
              }}
            ></TextField>
          </form>
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
    </>
  )
}

export default PinInput
