import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'

const OnOffSwitch = ({ isChecked, label, onChanged }: { isChecked: boolean; label: string; onChanged: (checked: boolean) => void }) => {
  const [checked, setChecked] = React.useState(isChecked)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked)
    onChanged(checked)
  }
  return <FormControlLabel control={<Switch size='small' onChange={handleChange} color='secondary' />} label={label} checked={checked} />
}

export default OnOffSwitch
