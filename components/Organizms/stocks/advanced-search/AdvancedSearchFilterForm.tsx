import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { StockAdvancedSearchFilter, StockAdvancedSearchFilterSchema } from './advancedSearchFilter'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import MarketCapSearch from './sections/MarketCapSearch'
import useAdvancedSearchUi, { AdvancedSearchUiController } from './stockAdvancedSearchUi'
import PagedStockTable from '../PagedStockTable'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { hasMovingAvgFilter } from './stocksAdvancedSearch'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import MovingAvgSearch from './sections/MovingAvgSearch'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

const AdvancedSearchFilterForm = ({
  onSubmitted,
  controller,
}: {
  onSubmitted: (item: StockAdvancedSearchFilter) => void
  controller: AdvancedSearchUiController
}) => {
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

  const onSubmit: SubmitHandler<StockAdvancedSearchFilter> = async (formData) => {
    const submitData = { ...formData }
    scroller.scroll()
    onSubmitted(submitData)
  }
  const scroller = useScrollTop(0)
  const handlePageChange = () => {
    scroller.scroll()
  }
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
          <MovingAvgSearch controller={controller} form={control} formValues={formValues} setValue={setValue} errors={errors} />
          {controller.model.isLoading && <BackdropLoader />}
          {controller.model.showResults && (
            <>
              <Typography textAlign={'center'} variant='h6' pt={2}>
                search results
              </Typography>
              <ScrollTop scroller={scroller} />
              <PagedStockTable
                data={controller.model.results}
                pageSize={5}
                onPageChanged={handlePageChange}
                showMovingAvgOnly={hasMovingAvgFilter(formValues)}
                scrollOnPageChange
              />
            </>
          )}

          <Box py={2} display={'flex'} justifyContent={'flex-end'} pr={1}>
            <PrimaryButton type='submit' text='Search' loading={controller.model.isLoading} />
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default AdvancedSearchFilterForm
