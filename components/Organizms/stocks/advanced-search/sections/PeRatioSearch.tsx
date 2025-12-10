import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AdvancedSearchUiController } from '../stockAdvancedSearchUi'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { StockAdvancedSearchFilter, StockMarketCapFilter, StockMovingAvgFilter, NumberRangeFilter } from '../advancedSearchFilter'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import { hasNumberRangeFilter } from '../stocksAdvancedSearch'
import CheckIcon from '@mui/icons-material/Check'

const PeRatioSearch = ({
  controller,
  form,
  formValues,
  setValue,
  errors,
}: {
  controller: AdvancedSearchUiController
  form: Control<StockAdvancedSearchFilter>
  formValues: StockAdvancedSearchFilter
  setValue: UseFormSetValue<StockAdvancedSearchFilter>
  errors: FieldErrors<StockAdvancedSearchFilter>
}) => {
  const setFieldValue = (fieldName: keyof NumberRangeFilter, val?: number | null) => {
    let newValues = { ...formValues.peRatio }
    newValues[fieldName] = val ?? undefined
    setValue('peRatio', newValues)
    const newFilter = { ...controller.model.filter, peRatio: newValues }
    controller.setModel({ ...controller.model, filter: newFilter })
  }
  const hasFilter = hasNumberRangeFilter(formValues.peRatio)

  return (
    <Accordion
      expanded={controller.model.expandPeRatio}
      onChange={(e, expanded) => {
        controller.setModel({ ...controller.model, expandPeRatio: expanded })
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography variant='h6'>P/E Ratio</Typography>
          {hasFilter && <CheckIcon fontSize='small' />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Box display={'flex'} gap={2}>
            <Controller
              name={'peRatio.from'}
              control={form}
              render={({ field: { value, onChange, ...field } }) => (
                <FormNumericTextField2
                  //placeholder='from'
                  label='from'
                  size='small'
                  value={formValues.peRatio?.from}
                  onChanged={(val?: number) => {
                    setFieldValue('from', val)
                  }}
                  {...field}
                  errorMessage={errors.peRatio?.from?.message}
                />
              )}
            />
            <Controller
              name={'peRatio.to'}
              control={form}
              render={({ field: { value, onChange, ...field } }) => (
                <FormNumericTextField2
                  label='to'
                  value={formValues.peRatio?.to}
                  onChanged={(val?: number) => {
                    setFieldValue('to', val)
                  }}
                  {...field}
                  errorMessage={errors.peRatio?.to?.message}
                />
              )}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default PeRatioSearch
