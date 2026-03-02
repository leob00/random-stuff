'use client'
import { Box } from '@mui/material'
import { TickerType, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { DropdownItem } from 'lib/models/dropdown'
import JsonView from 'components/Atoms/Boxes/JsonView'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { useState } from 'react'
import FormDropdownList from 'components/Molecules/Forms/ReactHookForm/FormDropdownList'

const mutateKey = 'admin-futures'
const AdminFuturesWrapper = ({ tickers }: { tickers: TickerType[] }) => {
  // const dataFn = async () => {
  //   const result = await serverGetFetch('/AdminFutures')
  // }

  // const { data, isLoading } = useSwrHelper(mutateKey, dataFn)

  const symbolLookup: DropdownItem[] = tickers.map((m) => {
    return {
      text: m.Name,
      value: m.Symbol,
    }
  })
  const [selectedSymbol, setSelectedSymbol] = useState<DropdownItem>(symbolLookup[0])

  const handleSymbolSelected = (val: string | null) => {
    var found = symbolLookup.find((m) => m.value === val)
    if (found) {
      setSelectedSymbol(found)
    }
  }

  return (
    <>
      <RequireClaim claimType='rs-admin'>
        <Box py={2}>
          <FormDropdownList options={symbolLookup} value={selectedSymbol.value} onOptionSelected={handleSymbolSelected} fullWidth />
        </Box>
        <JsonView obj={selectedSymbol} />
      </RequireClaim>
    </>
  )
}

export default AdminFuturesWrapper
