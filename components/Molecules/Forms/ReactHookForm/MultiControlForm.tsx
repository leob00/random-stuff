import { Box } from '@mui/material'
import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import ControlledLookUpSoloInput from './ControlledLookUpSoloInput'

interface FormInput {
  fieldName: string
  id: string
}
type FormValues = {
  //firstName: string
  fieldArray: FormInput[]
}

let renderCount = 0

export default function MutliControlForm() {
  const { register, handleSubmit, control, watch } = useForm<FormValues>()
  const { fields, append } = useFieldArray({
    control,
    name: 'fieldArray',
  })
  const onSubmit = (data: FormValues) => console.log(data)
  renderCount++
  //const watchFieldArray = watch('fieldArray')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      //...watchFieldArray[index],
    }
  })

  // console.log('updated', controlledFields)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <input {...register('firstName')} placeholder='First Name' /> */}

        {controlledFields.map((field, index) => {
          return (
            <Box key={field.id} py={2}>
              <ControlledLookUpSoloInput control={control} defaultValue='' fieldName={field.fieldName} label='label' options={['aaa', 'bb', 'cccc']} />
            </Box>
          )
          //return <input key={field.id} {...register(`fieldArray.${index}.name` as const)} />
        })}

        <button
          type='button'
          onClick={() =>
            append({
              fieldName: 'bill',
              id: `${controlledFields.length + 1}`,
            })
          }>
          Append
        </button>

        <input type='submit' />
      </form>
    </div>
  )
}
