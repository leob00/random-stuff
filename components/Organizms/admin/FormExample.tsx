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
  const ddlOptions: DropdownItem[] = [
    { text: 'aa', value: 'aa' },
    { text: 'bb', value: 'bb' },
    { text: 'cc', value: 'cc' },
  ]

  const formHelper = useFormHelper<FormInput>()
  formHelper.append('autoSolo', '', 'auto complete solo', 'autocompletesolo', true, ddlOptions)
  formHelper.append('freeText', '', 'free text', 'freetext', true)
  //formHelper.append('select', item.select, 'select', 'select', false, options)
  formHelper.append('onOff', false, 'on off switch', 'switch')
  formHelper.append('select', 'aa', 'select', 'select', false, ddlOptions)
  const handleSubmitted = (data: FormInput) => {
    console.log(data)
  }

  // React.useEffect(() => {
  //   const fn = async () => {
  //     const response = await fetch('../.././data/symbolCompanies.json')
  //     const data = (await response.json()) as SymbolCompany[]
  //     const ddl: DropdownItem[] = data.map((m) => {
  //       return {
  //         text: `${m.Symbol} - ${m.Company}`,
  //         value: m.Symbol,
  //       }
  //     })
  //     setOptions(ddl)
  //     //console.log(lookupData)
  //   }
  //   fn()
  // }, [])

  return (
    <>
      <DynamicForm inputs={formHelper.inputs()} onSubmitted={handleSubmitted} />
    </>
  )
}

export default FormExample
