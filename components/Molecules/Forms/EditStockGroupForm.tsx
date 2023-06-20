import { Alert, Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import DynamicForm from './DynamicForm'
import { useFormHelper } from './formHelper'
import ControlledLookUpSoloInput from './ReactHookForm/ControlledLookUpSoloInput'

interface FormInput {
  groupName: string
}

const EditStockGroupForm = ({ options, defaultValue, onSubmitted }: { options: DropdownItem[]; defaultValue: string; onSubmitted: (data: string) => void }) => {
  const formHelper = useFormHelper<FormInput>()
  formHelper.append('groupName', defaultValue, 'group name', 'autocompletesolo', true, options)
  const handleSubmitted = (data: FormInput) => {
    console.log(data)
    onSubmitted(data.groupName)
  }
  return (
    <Box>
      <DynamicForm<FormInput> inputs={formHelper.inputs()} onSubmitted={handleSubmitted} />
    </Box>
  )
}

export default EditStockGroupForm
