import { Box, Button } from '@mui/material'
import React from 'react'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import TextSkeleton from '../Skeletons/TextSkeleton'
const SecondaryCheckbox = ({ checked, loading = false, onChanged }: { checked?: boolean; loading?: boolean; onChanged: (checked: boolean) => void }) => {
  const [isChecked, setIsChecked] = React.useState(checked)
  const [isLoading, setIsLoading] = React.useState(loading)

  const handleCheckClick = (val: boolean) => {
    setIsChecked(val)
    onChanged(val)
  }

  React.useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading ? (
        <TextSkeleton width={30} />
      ) : (
        <Box>
          {isChecked ? (
            <Button
              sx={{ padding: 0 }}
              onClick={() => {
                handleCheckClick(false)
              }}
            >
              <CheckBoxOutlinedIcon color='secondary' />
            </Button>
          ) : (
            <Button
              sx={{ padding: 0 }}
              onClick={() => {
                handleCheckClick(true)
              }}
            >
              <CheckBoxOutlineBlankRoundedIcon color='secondary' />
            </Button>
          )}
        </Box>
      )}
    </>
  )
}

export default SecondaryCheckbox
