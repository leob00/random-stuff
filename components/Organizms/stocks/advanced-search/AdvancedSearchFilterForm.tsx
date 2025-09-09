import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { StockAdvancedSearchFilter, StockAdvancedSearchFilterSchema, StockMarketCapFilter } from './advancedSearchFilter'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import JsonView from 'components/Atoms/Boxes/JsonView'
import userAdvancedSearchUi from './stockAdvancedSearchUi'
import MarketCapSearch from './sections/MarketCapSearch'
import useAdvancedSearchUi from './stockAdvancedSearchUi'
import StockTable from '../StockTable'
import PagedStockTable from '../PagedStockTable'

const AdvancedSearchFilterForm = ({ onSubmitted }: { onSubmitted: (item: StockAdvancedSearchFilter) => void }) => {
  const { stockReportSettings, setStockMovingAvgFilter } = useLocalStore()

  const controller = useAdvancedSearchUi()

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
    mode: 'onChange',
    defaultValues: {
      marketCap: {
        includeMegaCap: false,
        includeLargeCap: false,
        includeMidCap: false,
        includeSmallCap: false,
      },
      take: 100,
      movingAvg: {
        days: 0,
      },
    },
  })

  const formValues = watch()

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
    //console.log(submitData)
    //setStockMovingAvgFilter(submitData)
    onSubmitted(submitData)
    controller.collapseAll()
    controller.executeSearch(submitData)
  }
  console.log(controller.model.results)
  return (
    <Box py={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Box width={{ md: '50%' }}>
            <Controller
              name={'take'}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormDropdownListNumeric minWidth={300} label='take' options={takeOptions} value={formValues.take} onOptionSelected={onChange} {...field} />
              )}
            />
          </Box>
          <MarketCapSearch controller={controller} form={control} formValues={formValues} setValue={setValue} />
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
                <Box display={'flex'} gap={2}>
                  <Controller
                    name={'movingAvg.from'}
                    control={control}
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
                    control={control}
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
          {/* <Box>{(errors.marketCap || errors.movingAvg) && <JsonView obj={errors} />}</Box> */}
          {controller.model.showResults && <PagedStockTable data={controller.model.results} />}

          <Box py={2} display={'flex'} justifyContent={'flex-end'} pr={1}>
            <PrimaryButton type='submit' text='Apply' />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default AdvancedSearchFilterForm
