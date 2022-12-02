import { Checkbox } from '@mui/material'
import React from 'react'

const SecondaryCheckbox = ({ checked, onChanged }: { checked?: boolean; onChanged: (checked: boolean) => void }) => {
  return (
    <Checkbox
      defaultChecked={checked}
      onChange={(e, val) => {
        onChanged(val)
      }}
    />
  )
}

export default SecondaryCheckbox
