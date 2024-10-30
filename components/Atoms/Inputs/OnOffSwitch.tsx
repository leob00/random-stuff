import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'

const OnOffSwitch = ({ isChecked = false, label, onChanged, disabled }: { isChecked?: boolean; label: string; onChanged: (checked: boolean) => void; disabled?: boolean }) => {
  const [checked, setChecked] = React.useState(isChecked)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked)
    onChanged(checked)
  }
  return <FormControlLabel control={<Switch size='small' onChange={handleChange} color={checked ? 'success' : 'secondary'} disabled={disabled} />} label={label} checked={checked} />
}

export default OnOffSwitch
