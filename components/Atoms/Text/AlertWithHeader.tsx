import { Alert, AlertColor, AlertTitle, Typography } from '@mui/material'

const AlertWithHeader = ({ header, text, severity }: { header?: string; text?: string; severity: AlertColor }) => {
  return (
    <Alert
      severity={severity}
      sx={{
        borderRadius: 8,
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
      {text && (
        <Typography variant='body2' sx={{ borderRadius: 4 }}>
          {text}
        </Typography>
      )}
    </Alert>
  )
}

export default AlertWithHeader
