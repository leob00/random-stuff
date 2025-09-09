import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AdvancedSearchUiController } from '../stockAdvancedSearchUi'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { StockAdvancedSearchFilter, StockMarketCapFilter } from '../advancedSearchFilter'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'

const MovingAvgSearch = ({
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
  const daysOptions: DropdownItemNumeric[] = [
    { text: 'select', value: 0 },
    { text: '1', value: 1 },
    { text: '7', value: 7 },
    { text: '30', value: 30 },
    { text: '90', value: 90 },
    { text: '180', value: 180 },
    { text: '365', value: 365 },
  ]
  return (
    <Accordion
      expanded={controller.model.expandMovingAvg}
      onChange={(e, expanded) => {
        controller.setModel({ ...controller.model, expandMovingAvg: expanded })
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
        <Typography variant='h6'>Moving Average</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Controller
            name={'movingAvg.days'}
            control={form}
            render={({ field: { value, onChange, ...field } }) => (
              <FormDropdownListNumeric
                minWidth={300}
                label='days'
                options={daysOptions}
                value={formValues.movingAvg?.days ?? 0}
                onOptionSelected={onChange}
                {...field}
                errorMessage={errors.movingAvg?.days?.message}
              />
            )}
          />
          <Box display={'flex'} gap={2}>
            <Controller
              name={'movingAvg.from'}
              control={form}
              render={({ field: { value, onChange, ...field } }) => (
                <FormNumericTextField2
                  //placeholder='from'
                  label='from %'
                  size='small'
                  value={formValues.movingAvg?.from}
                  onChanged={(val?: number) => {
                    setValue('movingAvg.from', val)
                  }}
                  {...field}
                  errorMessage={errors.movingAvg?.from?.message}
                />
              )}
            />
            <Controller
              name={'movingAvg.to'}
              control={form}
              render={({ field: { value, onChange, ...field } }) => (
                <FormNumericTextField2
                  label='to %'
                  value={formValues.movingAvg?.to}
                  onChanged={(val?: number) => {
                    setValue('movingAvg.to', val)
                  }}
                  {...field}
                  errorMessage={errors.movingAvg?.to?.message}
                />
              )}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default MovingAvgSearch
