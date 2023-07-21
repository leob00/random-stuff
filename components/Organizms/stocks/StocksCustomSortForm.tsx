import DynamicForm from 'components/Molecules/Forms/DynamicForm'
import { useFormHelper } from 'components/Molecules/Forms/formHelper'
import { Sort, UserSettings } from 'lib/backend/api/aws/apiGateway'
import { DropdownItem } from 'lib/models/dropdown'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import React from 'react'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import { Box, Stack } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { ControlledSelect } from 'components/Molecules/Forms/ReactHookForm/ControlledSelect'
import { StockQuote } from 'lib/backend/api/models/zModels'
interface FormInput {
  selectField: string
  selectDirection: 'asc' | 'desc'
  onOff: boolean
}
const StocksCustomSortForm = ({ result, onSubmitted }: { result: UserSettings; onSubmitted: (data?: Sort[]) => void }) => {
  //const sortableFields: [keyof StockQuote] = ['Symbol', 'Company', 'ChangePercent']
  let fieldOptions: DropdownItem[] = [
    { text: 'symbol', value: 'Symbol' },
    { text: 'company name', value: 'Company' },
    { text: 'change percent', value: 'ChangePercent' },
    { text: 'price', value: 'Price' },
    { text: 'market cap', value: 'MarketCap' },
  ]
  let directionOptions: DropdownItem[] = [
    { text: 'ascending', value: 'asc' },
    { text: 'descending', value: 'desc' },
  ]
  const customSort = result.stocks?.customSort
  const [data, setData] = React.useState(customSort)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = (formData: FormInput) => {
    const newSort: Sort[] | undefined = formData.onOff ? [{ key: formData.selectField, direction: formData.selectDirection }] : undefined
    //console.log('new sort: ', newSort)
    setData(newSort)
    onSubmitted(newSort)
  }
  const handleOnOffChanged = (val: boolean) => {
    //console.log('changed: ', val)
    if (val) {
      const newData: Sort[] = [
        {
          key: 'Symbol',
          direction: 'asc',
        },
      ]
      setData(newData)
    } else {
      setData(undefined)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <ControlledSwitch
            control={control}
            defaultValue={data !== undefined}
            fieldName={'onOff'}
            label={'enable custom sort'}
            onChanged={handleOnOffChanged}
          />
        </Stack>
        <Stack pt={4}>
          <ControlledSelect
            control={control}
            defaultValue={data ? data[0].key : ''}
            fieldName={'selectField'}
            label={'attribute'}
            items={fieldOptions}
            disabled={data === undefined}
          />
        </Stack>
        <Stack pt={4} pb={4}>
          <ControlledSelect
            control={control}
            defaultValue={data ? data[0].direction : ''}
            fieldName={'selectDirection'}
            label={'direction'}
            items={directionOptions}
            disabled={data === undefined}
          />
        </Stack>
        <HorizontalDivider />
        <Box display='flex' justifyContent={'flex-end'} pt={2}>
          <PrimaryButton text={'Save'} type='submit'></PrimaryButton>
        </Box>
      </form>
    </>
  )
}

export default StocksCustomSortForm
