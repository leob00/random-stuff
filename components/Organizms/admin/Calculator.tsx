import { Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredSubtitle from 'components/Atoms/Text/CenteredSubtitle'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Visibility from '@mui/icons-material/Visibility'

interface FormInput {
  total: number
  percent: number
}

const Calculator = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const [result, setResult] = React.useState(0)
  const [clearForm, setClearForm] = React.useState(false)
  const percentRef = React.useRef<HTMLInputElement | null>(null)

  const onSubmit: SubmitHandler<FormInput> = (formData: FormInput) => {
    const calc = (formData.percent * formData.total) / 100
    if (isNaN(calc)) {
      setResult(0)
    } else {
      setResult(Number(calc.toFixed(3)))
    }
  }
  const handleClearForm = () => {
    if (percentRef.current) {
      console.log('value: ', percentRef.current.value)
      percentRef.current.defaultValue = ''
      percentRef.current.value = ''
    }
  }

  return (
    <Box>
      <CenteredSubtitle text='calculate amount from percentage of total' />
      {!clearForm && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CenterStack>
              <Box py={2} display={'flex'} gap={1} alignItems={'center'}>
                <Stack width={90}>
                  <TextField
                    {...register('percent', { required: true })}
                    size='small'
                    label='Percent %'
                    //type='number'
                    // inputProps={{
                    //   inputMode: 'numeric',
                    // }}
                    InputProps={{
                      ref: percentRef,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Typography>of</Typography>
                <Stack width={90}>
                  <TextField
                    {...register('total', { required: true })}
                    size='small'
                    label='Total'
                    //type='number'
                    // inputProps={{
                    //   inputMode: 'numeric',
                    //   step: '.01',
                    // }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Stack>
                <Typography>=</Typography>
                <Typography variant={'h5'} sx={{ fontWeight: 700 }}>
                  {result}
                </Typography>
              </Box>
            </CenterStack>
            <CenterStack>
              <Box display={'flex'} gap={1}>
                <Button onClick={handleClearForm}>clear</Button>
                <PrimaryButton type='submit' text='submit' />
              </Box>
            </CenterStack>
          </form>
        </>
      )}
    </Box>
  )
}

export default Calculator
