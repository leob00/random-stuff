import { Sort, UserSettings } from 'lib/backend/api/aws/apiGateway'
import { DropdownItem } from 'lib/models/dropdown'
import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import { Alert, Box, Stack } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { ControlledSelect } from 'components/Molecules/Forms/ReactHookForm/ControlledSelect'
import { SortableStockKeys } from 'lib/backend/api/models/zModels'
interface FormInput {
  selectField: string
  selectDirection: 'asc' | 'desc'
  onOff: boolean
}
type ExtractKeys<T> = NonNullable<
  {
    [K in keyof T]: K
  }[keyof T]
>
const StocksCustomSortForm = ({ result, onSubmitted }: { result: UserSettings; onSubmitted: (data?: Sort[]) => void }) => {
  type Option = {
    text: string
    value: ExtractKeys<SortableStockKeys>
  }
  const fields: Option[] = [
    {
      value: 'Symbol',
      text: 'symbol',
    },
    {
      value: 'Company',
      text: 'company',
    },
    {
      value: 'ChangePercent',
      text: 'change percent',
    },
    {
      value: 'Price',
      text: 'price',
    },
    {
      value: 'MarketCap',
      text: 'market cap',
    },
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
    setData(newSort)
    onSubmitted(newSort)
  }
  const handleOnOffChanged = (val: boolean) => {
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
            items={fields}
            disabled={data === undefined}
            required
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
            required
          />
        </Stack>
        {/* {errors && result.stocks?.customSort && <Alert severity='error'>please enter all required fields</Alert>} */}
        <HorizontalDivider />
        <Box display='flex' justifyContent={'flex-end'} pt={2}>
          <PrimaryButton text={'Save'} type='submit'></PrimaryButton>
        </Box>
      </form>
    </>
  )
}

export default StocksCustomSortForm
