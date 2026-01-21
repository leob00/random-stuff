'use client'
import { Box } from '@mui/material'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import StaticAutoCompleteFreeSolo from 'components/Atoms/Inputs/StaticAutoCompleteFreeSolo'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/navigation'
import numeral from 'numeral'

const RecipesSearch = ({ autoComplete }: { autoComplete: DropdownItem[] }) => {
  const router = useRouter()
  const handleSelected = (item: DropdownItem) => {
    if (item.value.includes('tag:')) {
      const split = item.value.split(':')
      router.push(`/general-interest/recipeTags/tag/${split[1]}`)
    } else {
      router.push(`/general-interest/recipes/${item.value}`)
    }
  }
  return (
    <Box>
      <StaticAutoCompleteFreeSolo
        onSelected={handleSelected}
        searchResults={autoComplete}
        clearOnSelect
        placeholder={`search ${numeral(autoComplete.length).format('###,###')} recipes`}
      />
    </Box>
  )
}

export default RecipesSearch
