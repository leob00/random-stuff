import { Box, TextField } from '@mui/material'
import { StockSavedSearch } from '../advanced-search/stocksAdvancedSearch'
import { ChangeEvent, useState } from 'react'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import { useUserController } from 'hooks/userController'
import { getSavedStockSearches, putRecord } from 'lib/backend/csr/nextApiWrapper'

const getErroMessage = (val: string) => {
  if (val.trim().length === 0) {
    return 'required'
  }
  return undefined
}

const SaveStockSearchForm = ({ savedSearch, onClose }: { savedSearch: StockSavedSearch; onClose: () => void }) => {
  const [name, setName] = useState(savedSearch.name)
  const [isLoading, setIsLoading] = useState(false)
  const { authProfile } = useUserController()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(e.currentTarget.value)
  }
  const handleSave = async () => {
    const newRecord: StockSavedSearch = {
      name: name,
      filter: savedSearch.filter,
    }
    if (authProfile) {
      setIsLoading(true)
      const all = await getSavedStockSearches(authProfile)
      const existing = all.find((m) => m.name === name)
      if (!existing) {
        newRecord.id = crypto.randomUUID()
      } else {
        newRecord.id = existing.id
      }
      await putRecord(`stock-saved-search[${authProfile.username}][${newRecord.id}]`, `stock-saved-search[${authProfile.username}]`, newRecord)

      setIsLoading(false)
    }
    onClose()
  }
  return (
    <Box>
      <TextField
        placeholder='name'
        multiline
        sx={{ width: '100%' }}
        defaultValue={savedSearch.name}
        onChange={handleChange}
        slotProps={{
          input: {
            autoComplete: 'off',
          },
        }}
        error={!!getErroMessage(name)}
      />
      <Box display={'flex'} justifyContent={'flex-end'} py={2}>
        <SuccessButton text='save' onClick={handleSave} loading={isLoading} />
      </Box>
    </Box>
  )
}

export default SaveStockSearchForm
