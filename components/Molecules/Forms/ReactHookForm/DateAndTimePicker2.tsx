import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { forwardRef } from 'react'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { Box, Button, Typography } from '@mui/material'

type Props = {
  label?: string
  errorMessage?: string
  value?: string | null
  minDate?: string
  maxDate?: string
  placeHolder?: string
  onDateSelected: (arg: string | null) => void
  clearable?: boolean
}

const DateAndTimePicker2 = forwardRef<HTMLInputElement, Props>(function DateAndTimePicker(props: Props, _ref) {
  const { label, errorMessage, value, minDate, maxDate, placeHolder, onDateSelected, clearable } = props
  const { viewPortSize } = useViewPortSize()

  const handleSelect = (dt: dayjs.Dayjs | null) => {
    if (dt) {
      onDateSelected(dayjs(dt).format())
    } else {
      onDateSelected(null)
    }
  }
  const handleClear = () => {
    onDateSelected(null)
  }

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label={label}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          value={value ? dayjs(value) : null}
          onChange={handleSelect}
          slotProps={{
            field: { clearable: true },
            inputAdornment: {
              position: 'end',
              children: <CloseIconButton onClicked={handleClear} />,
            },
            textField: {
              placeholder: placeHolder,
              size: 'small',
              error: !!errorMessage,
              helperText: errorMessage,
              autoCorrect: 'off',
              fullWidth: true,
              sx: { width: '100%' }, // Alternative for specific width control
            },
          }}
        />
      </LocalizationProvider>
      {viewPortSize == 'xs' && clearable && value && (
        <Button onClick={handleClear}>
          <Typography variant='caption'>clear</Typography>
        </Button>
      )}
    </Box>
  )
})

export default DateAndTimePicker2
