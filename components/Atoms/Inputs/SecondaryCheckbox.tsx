import { Box, Button } from '@mui/material'
import React from 'react'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import TextSkeleton from '../Skeletons/TextSkeleton'
const SecondaryCheckbox = ({
  checked,
  loading = false,
  onChanged,
  disabled = false,
}: {
  checked?: boolean
  loading?: boolean
  onChanged: (checked: boolean) => void
  disabled?: boolean
}) => {
  const [isChecked, setIsChecked] = React.useState(checked)

  const handleCheckClick = (val: boolean) => {
    setIsChecked(val)
    onChanged(val)
  }

  React.useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  return (
    <>
      <Box>
        {isChecked ? (
          <Button
            disabled={disabled}
            sx={{ padding: 0 }}
            onClick={() => {
              handleCheckClick(false)
            }}
          >
            <CheckBoxOutlinedIcon color='secondary' />
          </Button>
        ) : (
          <Button
            disabled={disabled}
            sx={{ padding: 0 }}
            onClick={() => {
              handleCheckClick(true)
            }}
          >
            <CheckBoxOutlineBlankRoundedIcon color='secondary' />
          </Button>
        )}
      </Box>
    </>
  )
}

export default SecondaryCheckbox
