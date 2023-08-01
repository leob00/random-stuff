import { Alert, Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import React from 'react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import ControlledLookUpSoloInput from './ReactHookForm/ControlledLookUpSoloInput'
import { ControlledFreeTextInput } from './ReactHookForm/ControlledFreeTextInput'
import ControlledSwitch from './ReactHookForm/ControlledSwitch'
import { DropdownItem } from 'lib/models/dropdown'
import { ControlledSelect } from './ReactHookForm/ControlledSelect'

export type FormInputType = 'autocompletesolo' | 'freetext' | 'switch' | 'select'

export interface FormInput {
  label: string
  type: FormInputType
  name: string
  defaultValue: string | number | boolean
  required?: boolean
  options?: DropdownItem[]
  disabled?: boolean
  onChanged?: (val: string | boolean | number) => void
}

export default function DynamicForm<T extends FieldValues>({
  inputs,
  onSubmitted,
  onFieldChanged,
}: {
  inputs: FormInput[]
  onSubmitted: (data: T) => void
  onFieldChanged?: (val: string | boolean | number) => void
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>()
  const onSubmit: SubmitHandler<T> = (data: T) => {
    onSubmitted(data)
  }

  const renderControl = (input: FormInput) => {
    switch (input.type) {
      case 'autocompletesolo':
        return (
          <>
            <ControlledLookUpSoloInput
              control={control}
              options={input.options ? input.options.map((m) => m.text) : []}
              defaultValue={String(input.defaultValue)}
              fieldName={input.name}
              required
              label={input.label}
              disabled={input.disabled}
              onChanged={input.onChanged}
            />
            {errors[input.name] && (
              <Box py={2}>
                <Alert color='error'>{`${input.label} is required`}</Alert>
              </Box>
            )}
          </>
        )
      case 'freetext':
        return (
          <>
            <ControlledFreeTextInput control={control} defaultValue={String(input.defaultValue)} fieldName={input.name} label={input.label} required />
            {errors[input.name] && (
              <Box py={2}>
                <Alert color='error'>{`${input.label} is required`}</Alert>
              </Box>
            )}
          </>
        )
      case 'switch':
        return (
          <>
            <ControlledSwitch control={control} defaultValue={Boolean(input.defaultValue)} fieldName={input.name} onChanged={input.onChanged} />
          </>
        )
      case 'select':
        return (
          <>
            <ControlledSelect
              control={control}
              defaultValue={String(input.defaultValue)}
              fieldName={input.name}
              label={input.label}
              items={input.options!}
              disabled={input.disabled}
            />
          </>
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

        <HorizontalDivider />
        <Box display='flex' justifyContent={'flex-end'} pt={2}>
          <PrimaryButton text={'Save'} type='submit'></PrimaryButton>
        </Box>
      </form>
    </Box>
  )
}
