import { FormControlLabel, Switch, Typography } from '@mui/material'

const OnOffSwitch = ({
  isChecked = false,
  label,
  onChanged,
  disabled,
}: {
  isChecked?: boolean
  label: string
  onChanged: (checked: boolean) => void
  disabled?: boolean
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChanged(checked)
  }
  return (
    <FormControlLabel
      control={<Switch size='small' onChange={handleChange} color={isChecked ? 'success' : 'secondary'} disabled={disabled} checked={isChecked} />}
      label={<Typography variant='body2'>{label}</Typography>}
    />
  )
}

export default OnOffSwitch
