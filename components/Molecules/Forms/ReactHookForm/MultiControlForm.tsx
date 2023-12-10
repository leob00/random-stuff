import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import ControlledLookUpSoloInput from './ControlledLookUpSoloInput'

interface FormInput {
  fieldName: string
  id: string
}
type FormValues = {
  fieldArray: FormInput[]
}

export default function MutliControlForm() {
  const { register, handleSubmit, control, watch } = useForm<FormValues>()
  const { fields, append } = useFieldArray({
    control,
    name: 'fieldArray',
  })
  const onSubmit = (data: FormValues) => () => {}
  const watchFieldArray = watch('fieldArray')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledLookUpSoloInput control={control} defaultValue='' fieldName={'field0'} label='search' options={['aaa', 'bb', 'cccc']} />
        {controlledFields.map((field, index) => {
          return (
            <Box py={2} key={index}>
              <ControlledLookUpSoloInput
                key={field.id}
                control={control}
                defaultValue=''
                fieldName={field.fieldName}
                label='search'
                options={['aaa', 'bb', 'cccc']}
              />
            </Box>
          )
          //return <input key={field.id} {...register(`fieldArray.${index}.name` as const)} />
        })}
        <Box display={'flex'} gap={2} pt={4}>
          <SecondaryButton
            text={'Append'}
            onClick={() =>
              append({
                fieldName: `field${controlledFields.length + 1}`,
                id: `${controlledFields.length + 1}`,
              })
            }
          />
          <PrimaryButton type='submit' text={'Submit'} />
        </Box>
      </form>
    </div>
  )
}
