import { Alert, Box, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ControlledFreeTextInput } from 'components/Molecules/Forms/ReactHookForm/ControlledFreeTextInput'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CopyableText from 'components/Atoms/Text/CopyableText'

function checkPositiveNumber(val: any) {
  if (isNaN(val)) {
    return false
  }
  if (Number(val) <= 0) {
    return false
  }
  return true
}

const FormSchema = z.object({
  total: z.string().refine((val: any) => checkPositiveNumber(val), { message: 'Please enter a positive number for the total' }),
  percent: z.string().refine((val: any) => checkPositiveNumber(val), { message: 'Please enter a positive number for the percent' }),
})

type FormInput = z.infer<typeof FormSchema>

const TipCalculator = () => {
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
    const calc = (Number(formData.percent) * Number(formData.total)) / 100
    if (isNaN(calc)) {
      setResult(0)
    } else {
      setResult(Number(calc.toFixed(3)))
      setFormValues(formData)
    }
  }
  const calculateGrandTotal = () => {
    if (!formValues) {
      return 0
    }
    return Number(result) + Number(formValues.total)
  }
  const handleClearForm = () => {
    setResult(0)
    setFormValues(null)
    reset()
  }

  return (
    <Box>
      <CenteredHeader title='Tip calculator' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2} display={'flex'} gap={1} alignItems={'center'}>
          <Stack>
            <ControlledFreeTextInput control={control} label='Total' fieldName='total' defaultValue='' required />
          </Stack>
          <Stack>
            <ControlledFreeTextInput control={control} label='Percent %' fieldName='percent' defaultValue='' required />
          </Stack>
        </Box>
        {formValues && (
          <Box pb={4}>
            <Card>
              <CardContent>
                <Box display={'flex'} flexDirection={'column'} gap={2}>
                  <Typography variant={'h5'}>{`result: $${result}`}</Typography>
                </Box>
              </CardContent>
            </Card>
            <HorizontalDivider />
            <Box display={'flex'} justifyContent={'end'}>
              <Typography variant={'h5'}>{`total: $${calculateGrandTotal()}`}</Typography>
            </Box>
          </Box>
        )}
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          {errors.total && (
            <Box py={2}>
              <Alert severity='error'>{errors.total.message}</Alert>
            </Box>
          )}
          {errors.percent && (
            <Box py={2}>
              <Alert severity='error'>{errors.percent.message}</Alert>
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

export default TipCalculator
