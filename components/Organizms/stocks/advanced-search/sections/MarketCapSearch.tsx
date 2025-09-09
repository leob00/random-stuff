import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AdvancedSearchUiController } from '../stockAdvancedSearchUi'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { Control, UseFormSetValue } from 'react-hook-form'
import { StockAdvancedSearchFilter, StockMarketCapFilter } from '../advancedSearchFilter'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'

const MarketCapSearch = ({
  controller,
  form,
  formValues,
  setValue,
}: {
  controller: AdvancedSearchUiController
  form: Control<StockAdvancedSearchFilter>
  formValues: StockAdvancedSearchFilter
  setValue: UseFormSetValue<StockAdvancedSearchFilter>
}) => {
  const setMarketCapField = (fieldName: keyof StockMarketCapFilter, val: boolean) => {
    let newValues = { ...formValues.marketCap }
    newValues[fieldName] = val
    setValue('marketCap', newValues)
  }
  return (
    <Accordion
      expanded={controller.model.expandMarketCap}
      onChange={(e, expanded) => {
        controller.setModel({ ...controller.model, expandMarketCap: expanded })
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
        <Typography variant='h6'>Market Cap</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <ControlledSwitch
            control={form}
            fieldName='marketCap.includeMegaCap'
            label='include mega cap'
            defaultValue={formValues.marketCap.includeMegaCap ?? false}
            onChanged={(val: boolean) => {
              setMarketCapField('includeMegaCap', val)
            }}
          />
          <ControlledSwitch
            control={form}
            fieldName='marketCap.includeLargeCap'
            label='include large cap'
            defaultValue={formValues.marketCap?.includeLargeCap ?? false}
            onChanged={(val: boolean) => {
              setMarketCapField('includeLargeCap', val)
            }}
          />
          <ControlledSwitch
            control={form}
            fieldName='marketCap.includeMidCap'
            label='include mid cap'
            defaultValue={formValues.marketCap?.includeMidCap ?? false}
            onChanged={(val: boolean) => {
              setMarketCapField('includeMidCap', val)
            }}
          />
          <ControlledSwitch
            control={form}
            fieldName='marketCap.includeSmallCap'
            label='include small cap'
            defaultValue={formValues.marketCap?.includeSmallCap ?? false}
            onChanged={(val: boolean) => {
              setMarketCapField('includeSmallCap', val)
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default MarketCapSearch
