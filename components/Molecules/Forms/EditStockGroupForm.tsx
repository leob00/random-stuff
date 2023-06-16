import { Alert, Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormLookUpSoloInput from './ReactHookForm/FormLookUpSoloInput'

export type GroupInputs = {
  name: string
}

const EditStockGroupForm = ({ options, defaultValue, onSubmitted }: { options: string[]; defaultValue: string; onSubmitted: (data: string) => void }) => {
  //   const {
  //     register,
  //     handleSubmit,
  //     watch,
  //     formState: { errors },
  //   } = useForm<Inputs>()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupInputs>()
  const onSubmit: SubmitHandler<GroupInputs> = (data) => {
    //console.log(data)
    onSubmitted(data.name)
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2}>
          <FormLookUpSoloInput control={control} options={options} defaultValue={defaultValue} fieldName='name' required />
        </Box>
        {errors.name && (
          <Box py={2}>
            <Alert color='error'>This field is required</Alert>
          </Box>
        )}
        <HorizontalDivider />
        <Box display='flex' justifyContent={'flex-end'} pt={2}>
          <PrimaryButton text={'Save'} type='submit'></PrimaryButton>
        </Box>
      </form>
    </Box>
  )
}

export default EditStockGroupForm
