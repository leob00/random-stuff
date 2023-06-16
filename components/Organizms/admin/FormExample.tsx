import EditStockGroupForm from 'components/Molecules/Forms/EditStockGroupForm'
import React from 'react'

const FormExample = () => {
  const handleSubmitted = (text: string) => {
    console.log(text)
  }
  return <EditStockGroupForm onSubmitted={handleSubmitted} defaultValue='' options={['aa', 'bb', 'cc']} />
}

export default FormExample
