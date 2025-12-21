import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { JSX, ReactNode } from 'react'

const GlobalAccordion = ({
  title,
  isExpanded,
  onExpandCollapse,
  children,
}: {
  title: string
  isExpanded: boolean
  onExpandCollapse: (expaned: boolean) => void
  children: ReactNode | JSX.Element[]
}) => {
  return (
    <Accordion
      expanded={isExpanded}
      onChange={(e, expanded) => {
        onExpandCollapse(expanded)
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography variant='h6'>{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}

export default GlobalAccordion
