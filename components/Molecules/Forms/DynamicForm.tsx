import { Alert, Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import React from 'react'
import { useForm, SubmitHandler, Control, FieldValues } from 'react-hook-form'
import FormLookUpSoloInput from './ReactHookForm/FormLookUpSoloInput'

export type GroupInputs = {
  name: string
}

export type FormInputType = 'autocompletesolo'

export interface FormInput {
  label: string
  type: FormInputType
  name: string
  defaultValue: string | number | boolean
  options?: string[]
}

export default function DynamicForm({ inputs, onSubmitted }: { inputs: FormInput[]; onSubmitted: (data: any) => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>()
  const onSubmit: SubmitHandler<any> = (data: any) => {
    //console.log(data)
    onSubmitted(data)
  }

  const renderControl = (input: FormInput) => {
    switch (input.type) {
      case 'autocompletesolo':
        return (
          <FormLookUpSoloInput
            control={control}
            options={input.options ?? []}
            defaultValue={String(input.defaultValue)}
            fieldName={input.name}
            required
            label={input.label}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputs.map((input, index) => (
          <Box key={index} py={2}>
            {renderControl(input)}
          </Box>
        ))}
        {/* <Box py={2}>
          <FormLookUpSoloInput control={control} options={options} defaultValue={defaultValue} fieldName='name' required />
        </Box>
        {errors.name && (
          <Box py={2}>
            <Alert color='error'>This field is required</Alert>
          </Box>
        )}
        */}
        <HorizontalDivider />
        <Box display='flex' justifyContent={'flex-end'} pt={2}>
          <PrimaryButton text={'Save'} type='submit'></PrimaryButton>
        </Box>
      </form>
    </Box>
  )
}
