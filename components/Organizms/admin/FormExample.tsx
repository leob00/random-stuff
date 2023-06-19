import DynamicForm, { FormInput } from 'components/Molecules/Forms/DynamicForm'
import EditStockGroupForm from 'components/Molecules/Forms/EditStockGroupForm'
import MultiControlForm from 'components/Molecules/Forms/ReactHookForm/MultiControlForm'
import React from 'react'
interface Input {
  name: string
}
const FormExample = () => {
  const handleSubmitted = (data: Input) => {
    console.log(data)
  }

  const inputs: FormInput[] = [
    {
      label: 'auto complete solo',
      defaultValue: '',
      name: 'name',
      type: 'autocompletesolo',
      options: ['aa', 'bb', 'cc'],
    },
  ]
  return <MultiControlForm />
  // <DynamicForm onSubmitted={handleSubmitted} inputs={inputs} />
}

export default FormExample
