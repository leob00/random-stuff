import React from 'react'
import { FormInput, FormInputType } from './DynamicForm'

export function useFormHelper<T>(item: T) {
  const [inputs, setInputs] = React.useState<FormInput[]>([])

  return {
    inputs: () => {
      return [...inputs]
    },
    append: (fieldName: keyof T, defaultValue: string | number | boolean, label: string, inputType: FormInputType) => {
      const newInput: FormInput = {
        defaultValue: defaultValue,
        label: label,
        name: String(fieldName),
        type: inputType,
      }
      const result = [...inputs]
      inputs.push(newInput)
      setInputs(result)
      return result
    },
  }
}
