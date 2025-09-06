import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { StockMovingAvgFilter, StockMovingAvgFilterSchema } from '../reports/stockMovingAvgFilter'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { StockAdvancedSearchFilter, StockAdvancedSearchFilterSchema, StockMarketCapFilter } from './advancedSearchFilter'
import FormNumericTextField from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import JsonPreview from 'components/Molecules/Forms/Files/JsonPreview'
import JsonView from 'components/Atoms/Boxes/JsonView'
import { error } from 'console'
const AdvancedSearchFilterForm = ({ onSubmitted }: { onSubmitted: (item: StockMovingAvgFilter) => void }) => {
  const { stockReportSettings, setStockMovingAvgFilter } = useLocalStore()

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StockAdvancedSearchFilter>({
    resolver: zodResolver(StockAdvancedSearchFilterSchema),
    mode: 'onTouched',
    defaultValues: {
      marketCap: {
        includeMegaCap: false,
        includeLargeCap: false,
        includeMidCap: false,
        includeSmallCap: false,
      },
      take: 1,
      movingAvg: {
        days: 0,
      },
    },
  })

  const formValues = watch()
  const hasMarkeCapFilter =
    formValues.marketCap?.includeMegaCap ||
    formValues.marketCap?.includeLargeCap ||
    formValues.marketCap?.includeMidCap ||
    formValues.marketCap?.includeSmallCap
  const takeOptions: DropdownItemNumeric[] = [
    { text: '1', value: 1 },
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '25', value: 25 },
    { text: '100', value: 100 },
    { text: '250', value: 250 },
    { text: '500', value: 500 },
  ]

  const daysOptions: DropdownItemNumeric[] = [
    { text: 'select', value: 0 },
    { text: '1', value: 1 },
    { text: '7', value: 7 },
    { text: '30', value: 30 },
    { text: '90', value: 90 },
    { text: '180', value: 180 },
    { text: '365', value: 365 },
  ]

  const setMarketCapField = (fieldName: keyof StockMarketCapFilter, val: boolean) => {
    let newValues = { ...formValues.marketCap }

    newValues[fieldName] = val
    setValue('marketCap', newValues)
  }

  const onSubmit: SubmitHandler<StockAdvancedSearchFilter> = (formData) => {
    const submitData = { ...formData }
    console.log(submitData)
    //setStockMovingAvgFilter(submitData)
    //onSubmitted(submitData)
  }
  //console.log(errors)
  return (
    <Box py={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Controller
              name={'take'}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormDropdownListNumeric minWidth={300} label='take' options={takeOptions} value={formValues.take} onOptionSelected={onChange} {...field} />
              )}
            />

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
                <Typography variant='h6'>Market Cap</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <ControlledSwitch
                    control={control}
                    fieldName='marketCap.includeMegaCap'
                    label='include mega cap'
                    defaultValue={formValues.marketCap.includeMegaCap ?? false}
                    onChanged={(val: boolean) => {
                      setMarketCapField('includeMegaCap', val)
                    }}
                  />
                  <ControlledSwitch
                    control={control}
                    fieldName='marketCap.includeLargeCap'
                    label='include large cap'
                    defaultValue={formValues.marketCap?.includeLargeCap ?? false}
                    onChanged={(val: boolean) => {
                      setMarketCapField('includeLargeCap', val)
                    }}
                  />
                  <ControlledSwitch
                    control={control}
                    fieldName='marketCap.includeMidCap'
                    label='include mid cap'
                    defaultValue={formValues.marketCap?.includeMidCap ?? false}
                    onChanged={(val: boolean) => {
                      setMarketCapField('includeMidCap', val)
                    }}
                  />
                  <ControlledSwitch
                    control={control}
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
          </Box>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
              <Typography variant='h6'>Moving Average</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Controller
                  name={'movingAvg.days'}
                  control={control}
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
                <Controller
                  name={'movingAvg.from'}
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormNumericTextField2
                      placeholder='from'
                      //label='from'
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
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormNumericTextField2
                      placeholder='to'
                      //label='from'
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
            </AccordionDetails>
          </Accordion>
          <Box>{(errors.marketCap || errors.movingAvg) && <JsonView obj={errors} />}</Box>
          <Box>{!errors?.root && <JsonView obj={formValues} />}</Box>

          <Box py={2} display={'flex'} justifyContent={'flex-end'} pr={1}>
            <PrimaryButton type='submit' text='Apply' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default AdvancedSearchFilterForm
