import { DropdownItem } from 'lib/models/dropdown'
import { useForm, SubmitHandler } from 'react-hook-form'
import ControlledSwitch from 'components/Molecules/Forms/ReactHookForm/ControlledSwitch'
import { Box, Stack } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { ControlledSelect } from 'components/Molecules/Forms/ReactHookForm/ControlledSelect'
import { SortableStockKeys, StockQuote } from 'lib/backend/api/models/zModels'
import { type StockQuoteSort } from 'lib/backend/api/models/collections'
import { useState } from 'react'
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

type Keys = keyof SortableStockKeys & {}
const StocksCustomSortForm = ({
  result,
  onSubmitted,
  required = false,
}: {
  result?: StockQuoteSort[]
  onSubmitted: (data?: StockQuoteSort[]) => void
  required?: boolean
}) => {
  type Option = {
    text: string
    value: Keys
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
  const [data, setData] = useState(result)
  const [isMutating, setIsMutating] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = (formData: FormInput) => {
    const newSort: StockQuoteSort[] | undefined = formData.onOff
      ? [{ key: formData.selectField as keyof StockQuote, direction: formData.selectDirection }]
      : undefined
    setIsMutating(true)
    setData(newSort)
    onSubmitted(newSort)
  }
  const handleOnOffChanged = (val: boolean) => {
    if (val) {
      const newData: StockQuoteSort[] = [
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
        <Stack sx={{ display: required ? 'none' : 'unset' }}>
          <ControlledSwitch control={control} defaultValue={data !== undefined} fieldName={'onOff'} onChanged={handleOnOffChanged} />
        </Stack>
        <Stack pt={4}>
          <ControlledSelect
            control={control}
            defaultValue={data ? data[0].key : ''}
            fieldName={'selectField'}
            label={'attribute'}
            items={fields}
            disabled={data === undefined || isMutating}
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
            disabled={data === undefined || isMutating}
            required
          />
        </Stack>
        <HorizontalDivider />
        <Box display='flex' justifyContent={'flex-end'} pt={2}>
          <PrimaryButton text={'Save'} type='submit' disabled={isMutating}></PrimaryButton>
        </Box>
      </form>
    </>
  )
}

export default StocksCustomSortForm
