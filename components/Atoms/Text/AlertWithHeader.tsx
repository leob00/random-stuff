import { Alert, AlertColor, AlertTitle, Typography, useTheme } from '@mui/material'

const AlertWithHeader = ({ header, text, severity }: { header?: string; text?: string; severity: AlertColor }) => {
  const theme = useTheme()

  return (
    <Alert
      severity={severity}
      sx={{
        backgroundColor: 'transparent',
      }}
    >
      {header && (
        <AlertTitle color={severity}>
          <Typography variant='h6' mt={-0.75}>
            {header}
          </Typography>
        </AlertTitle>
      )}
      {text && <Typography variant='body2'>{text}</Typography>}
    </Alert>
  )
}

export default AlertWithHeader
