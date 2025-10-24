import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AdvancedSearchUiController } from '../stockAdvancedSearchUi'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { StockAdvancedSearchFilter, NumberRangeFilter } from '../advancedSearchFilter'
import FormNumericTextField2 from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField2'
import CheckIcon from '@mui/icons-material/Check'
import { hasNumberRangeFilter } from '../stocksAdvancedSearch'
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { orderBy } from 'lodash'
import DeletableChipList from 'components/Atoms/Inputs/DeletableChipList'

const SymbolSearch = ({
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
    let newValues = { ...formValues.annualYield }
    newValues[fieldName] = val ?? undefined
    setValue('annualYield', newValues)
    const newFilter = { ...controller.model.filter, annualYield: newValues }
    controller.setModel({ ...controller.model, filter: newFilter })
  }
  const hasFilter = formValues.symbols && formValues.symbols.length > 0

  const handleAddSymbol = (quote: StockQuote) => {
    const symbols = new Set(formValues.symbols ?? [])
    symbols.add(quote.Symbol)
    const newValues = orderBy(Array.from(symbols))
    setValue('symbols', newValues)
    const newFilter = { ...controller.model.filter, symbols: newValues }
    controller.setModel({ ...controller.model, filter: newFilter })
  }
  const handleDelete = (item: string) => {
    let newValues = formValues.symbols?.filter((m) => m !== item) ?? []
    if (newValues.length === 0) {
      setValue('symbols', undefined)
      const newFilter = { ...controller.model.filter, symbols: undefined }
      controller.setModel({ ...controller.model, filter: newFilter })
    } else {
      setValue('symbols', newValues)
      const newFilter = { ...controller.model.filter, symbols: newValues }
      controller.setModel({ ...controller.model, filter: newFilter })
    }
  }

  return (
    <Accordion
      expanded={controller.model.expandSymbols}
      onChange={(e, expanded) => {
        controller.setModel({ ...controller.model, expandSymbols: expanded })
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize='small' color='primary' />} sx={{ borderTop: `solid 1px ${CasinoGrayTransparent}` }}>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography variant='h6'>Symbols</Typography>
          {hasFilter && <CheckIcon fontSize='small' />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography py={2} variant='body2'>
            Using this filter will override other filters. The symbols filter is best used if you want to create a stock watch list.
          </Typography>
          <StockSearch onSymbolSelected={handleAddSymbol} showAdvSearch={false} clearOnSelect />
        </Box>
        {formValues.symbols && <DeletableChipList values={formValues.symbols} onDelete={handleDelete} />}
        {/* <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Box display={'flex'} gap={2}>
            <Controller
              name={'annualYield.from'}
              control={form}
              render={({ field: { value, onChange, ...field } }) => (
                <FormNumericTextField2
                  //placeholder='from'
                  label='from'
                  size='small'
                  value={formValues.annualYield?.from}
                  onChanged={(val?: number) => {
                    setFieldValue('from', val)
                  }}
                  {...field}
                  errorMessage={errors.annualYield?.from?.message}
                />
              )}
            />
            <Controller
              name={'annualYield.to'}
              control={form}
              render={({ field: { value, onChange, ...field } }) => (
                <FormNumericTextField2
                  label='to'
                  value={formValues.annualYield?.to}
                  onChanged={(val?: number) => {
                    setFieldValue('to', val)
                  }}
                  {...field}
                  errorMessage={errors.annualYield?.to?.message}
                />
              )}
            />
          </Box>
        </Box> */}
      </AccordionDetails>
    </Accordion>
  )
}

export default SymbolSearch
