import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'
import { FormInput, FormInputType } from './DynamicForm'

export function useFormHelper<T>() {
  const inputs: FormInput[] = []

  return {
    inputs: () => {
      return [...inputs]
    },
    append: (
      fieldName: keyof T,
      defaultValue: string | number | boolean,
      label: string,
      inputType: FormInputType,
      required?: boolean,
      options?: DropdownItem[],
      disabled?: boolean,
      onChanged?: (val: string | boolean | number) => void,
    ) => {
      const newInput: FormInput = {
        defaultValue: defaultValue,
        label: label,
        name: String(fieldName),
        type: inputType,
        options: options,
        required: required,
        disabled: disabled,
        onChanged: onChanged,
      }
      inputs.push(newInput)
    },
  }
}
