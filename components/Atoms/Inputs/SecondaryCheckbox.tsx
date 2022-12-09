import { Button, Checkbox } from '@mui/material'
import React from 'react'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
const SecondaryCheckbox = ({ checked, onChanged }: { checked?: boolean; onChanged: (checked: boolean) => void }) => {
  const [isChecked, setIsChecked] = React.useState(checked)
  const handleCheckClick = () => {
    let chk = !isChecked
    setIsChecked(chk)
    onChanged(chk)
  }
  return (
    <>
      <Button onClick={handleCheckClick} sx={{ padding: 0 }}>
        {isChecked ? <CheckBoxOutlinedIcon color='secondary' /> : <CheckBoxOutlineBlankRoundedIcon color='secondary' />}
      </Button>
    </>
  )
}

export default SecondaryCheckbox
