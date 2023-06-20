import DynamicForm from 'components/Molecules/Forms/DynamicForm'
import { useFormHelper } from 'components/Molecules/Forms/formHelper'
import { DropdownItem } from 'lib/models/dropdown'

import React from 'react'

interface FormInput {
  autoSolo: string
  freeText: string
  select: string
  onOff: boolean
}

const FormExample = () => {
  const item: FormInput = {
    autoSolo: '',
    freeText: '',
    select: 'aa',
    onOff: false,
  }
  const options: DropdownItem[] = [
    { text: 'aa', value: 'aa' },
    { text: 'bb', value: 'bb' },
    { text: 'cc', value: 'cc' },
  ]
  const formHelper = useFormHelper<FormInput>()
  formHelper.append('autoSolo', item.autoSolo, 'auto complete solo', 'autocompletesolo', true, options)
  formHelper.append('freeText', item.freeText, 'free text', 'freetext', true)
  formHelper.append('select', item.select, 'select', 'select', false, options)
  formHelper.append('onOff', item.onOff, 'on off switch', 'switch')

  const handleSubmitted = (data: FormInput) => {
    console.log(data)
  }

  return (
    <>
      <DynamicForm<FormInput> inputs={formHelper.inputs()} onSubmitted={handleSubmitted} />
    </>
  )
}

export default FormExample
