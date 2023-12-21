import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import JsonView from 'components/Atoms/Boxes/JsonView'
import MutliControlForm, { FormValues } from 'components/Molecules/Forms/ReactHookForm/MultiControlForm'
import React from 'react'

const Playground = () => {
  const [formResult, setFormResult] = React.useState<string | null>(null)

  const handleSubmitForm = (formData: any) => {
    setFormResult(JSON.stringify(formData))
  }
  return (
    <Box py={2}>
      <CenteredHeader title='Playground' />
      <MutliControlForm onSubmitted={handleSubmitForm} />
      {formResult && <JsonView obj={formResult} />}
    </Box>
  )
}

export default Playground
