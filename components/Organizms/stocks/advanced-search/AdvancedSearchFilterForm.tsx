import { Box, Typography } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { StockAdvancedSearchFilter, StockAdvancedSearchFilterSchema } from './advancedSearchFilter'
import MarketCapSearch from './sections/MarketCapSearch'
import { AdvancedSearchUiController } from './stockAdvancedSearchUi'
import MovingAvgSearch from './sections/MovingAvgSearch'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PeRatioSearch from './sections/PeRatioSearch'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import { useState } from 'react'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import SaveStockSearchForm from '../saved-searches/SaveStockSearchForm'
import { summarizeFilter } from './stocksAdvancedSearch'
import AnnualYieldSearch from './sections/AnnualYieldSearch'
import SymbolSearch from './sections/SymbolSearch'

const AdvancedSearchFilterForm = ({
  onSubmitted,
  controller,
  filter,
  onSaved,
  showSubmitButton = true,
  savedSearchId,
}: {
  onSubmitted: (item: StockAdvancedSearchFilter) => void
  controller: AdvancedSearchUiController
  filter: StockAdvancedSearchFilter
  onSaved?: () => void
  showSubmitButton?: boolean
  savedSearchId?: string
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StockAdvancedSearchFilter>({
    resolver: zodResolver(StockAdvancedSearchFilterSchema),
    mode: 'onChange',
    defaultValues: filter,
  })

  const [showSaveForm, setShowSaveForm] = useState(false)

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
    onSubmitted(submitData)
  }

  const handleShowSaveForm = () => {
    setShowSaveForm(true)
  }
  const filterSummary = summarizeFilter(formValues)

  return (
    <>
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
            <PeRatioSearch controller={controller} form={control} formValues={formValues} setValue={setValue} errors={errors} />
            <AnnualYieldSearch controller={controller} form={control} formValues={formValues} setValue={setValue} errors={errors} />
            <SymbolSearch controller={controller} form={control} formValues={formValues} setValue={setValue} errors={errors} />
            {controller.model.isLoading && <BackdropLoader />}
            {/* {!showSubmitButton && <Typography textAlign={'center'}>{filterSummary.summary}</Typography>} */}
            <Box py={2} display={'flex'} justifyContent={'flex-end'} pr={1} gap={1}>
              {controller.model.allowSave && (
                <Box>
                  <Box display={'flex'}>
                    <SuccessButton text='save' onClick={handleShowSaveForm} />
                  </Box>
                </Box>
              )}

              {showSubmitButton && <PrimaryButton type='submit' text='search' loading={controller.model.isLoading} />}
            </Box>
          </Box>
        </form>
      </Box>
      {showSaveForm && (
        <InfoDialog title='save search' show={showSaveForm} onCancel={() => setShowSaveForm(false)} fullScreen={false}>
          <SaveStockSearchForm
            savedSearch={{ name: filterSummary.summary, filter: formValues, id: savedSearchId }}
            onClose={() => {
              setShowSaveForm(false)
              onSaved?.()
            }}
          />
        </InfoDialog>
      )}
    </>
  )
}

export default AdvancedSearchFilterForm
