import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculateStockMovePercent } from 'lib/util/numberUtil'

function checkPositiveNumber(val: any) {
  if (isNaN(val)) {
    return false
  }
  if (Number(val) <= 0) {
    return false
  }
  return true
}

function checkNumber(val: any) {
  return !isNaN(val)
}

const FormSchema = z.object({
  price: z.string().refine((val: any) => checkPositiveNumber(val), { message: 'Please enter a positive number for the price' }),
  change: z.string().refine((val: any) => checkNumber(val), { message: 'Please enter a number for the change' }),
})

type FormInput = z.infer<typeof FormSchema>

const StockCalculator = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
  })

  const [result, setResult] = React.useState(0)
  const [formValues, setFormValues] = React.useState<FormInput | null>(null)

  const onSubmit: SubmitHandler<FormInput> = (formData: FormInput) => {
    const calc = calculateStockMovePercent(Number(formData.price), Number(formData.change))
    if (isNaN(calc)) {
      setResult(0)
    } else {
      setResult(Number(calc.toFixed(3)))
      setFormValues(formData)
    }
  }

  const handleClearForm = () => {
    setResult(0)
    setFormValues(null)
    reset()
  }

  return (
    <Box>
      <CenteredHeader title='Stock move percent calculator' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2} display={'flex'} gap={1} alignItems={'center'}>
          <Stack>
            <ControlledFreeTextInput control={control} label='Price' fieldName='price' defaultValue='' required />
          </Stack>
          <Stack>
            <ControlledFreeTextInput control={control} label='Change' fieldName='change' defaultValue='' required />
          </Stack>
        </Box>
        {formValues && (
          <Box pb={4}>
            <Card>
              <CardContent>
                <Box display={'flex'} flexDirection={'column'} gap={2}>
                  <Typography variant={'h5'}>{`result: ${result}%`}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          {errors.price && (
            <Box py={2}>
              <Alert severity='error'>{errors.price.message}</Alert>
            </Box>
          )}
          {errors.change && (
            <Box py={2}>
              <Alert severity='error'>{errors.change.message}</Alert>
            </Box>
          )}
        </Box>
        <Box display={'flex'} gap={1}>
          <Button onClick={handleClearForm}>clear</Button>
          <PrimaryButton type='submit' text='submit' />
        </Box>
      </form>
    </Box>
  )
}

export default StockCalculator
