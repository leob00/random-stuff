import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import React from 'react'
import { useForm, useFieldArray, FieldValues, SubmitHandler } from 'react-hook-form'
import { ControlledFreeTextInput } from './ControlledFreeTextInput'
import ControlledLookUpSoloInput from './ControlledLookUpSoloInput'
import ControlledSwitch from './ControlledSwitch'

interface FormInput {
  fieldName: string
  id: string
}
export type FormValues = {
  fieldArray: FormInput[]
}
interface Fruit {
  text: string
  selected: boolean
}

export default function MutliControlForm({ onSubmitted }: { onSubmitted?: (formValues: any) => void }) {
  const arrayName = 'fieldArray'

  const { register, handleSubmit, control, watch } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: arrayName,
  })

  const onSubmit: SubmitHandler<FieldValues> = (formData: FieldValues) => {
    const submitData = formData[arrayName]
    onSubmitted?.(submitData)
  }

  const handleAppend = () => {
    append('testing')
  }
  const handleClear = () => {
    const indexes = fields.map((_, index) => index)
    remove(indexes)
  }

  const watchFieldArray = watch(arrayName)
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  // React.useEffect(() => {
  //   remove(0)
  // }, [remove])

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data)
        })}
      >
        {controlledFields.map((field, index) => (
          <Box py={2} key={index} display={'flex'} gap={2}>
            {/* <ControlledSwitch control={control} key={field.id} defaultValue={false} fieldName={`${arrayName}.${index}.value`} /> */}
            <ControlledFreeTextInput key={field.id} control={control} fieldName={`${arrayName}.${index}.value`} label='' defaultValue={``} required />

            {/* <input
              key={field.id} // important to include key with field's id
              {...register(`test.${index}.value`)}
            /> */}
          </Box>
        ))}
        {/* <ControlledLookUpSoloInput control={control} defaultValue='aaa' fieldName={'field0'} label='search' options={['aaa', 'bb', 'cccc']} />
        {controlledFields.map((field, index) => {
          return (
            <Box py={2} key={field.id}>
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
        })} */}

        <Box display={'flex'} gap={2} pt={4}>
          <SecondaryButton text={'Append'} onClick={handleAppend} />
          <SecondaryButton text={'Clear'} onClick={handleClear} />
          <PrimaryButton type='submit' text={'Submit'} />
        </Box>
      </form>
    </div>
  )
}
