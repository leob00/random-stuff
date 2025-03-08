import { Box } from '@mui/material'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import StaticAutoCompleteFreeSolo from 'components/Atoms/Inputs/StaticAutoCompleteFreeSolo'
import { DropdownItem } from 'lib/models/dropdown'
import router from 'next/router'
import numeral from 'numeral'

const RecipesSearch = ({ autoComplete }: { autoComplete: DropdownItem[] }) => {
  const handleSelected = (item: DropdownItem) => {
    if (item.value.includes('tag:')) {
      const split = item.value.split(':')
      router.push(`/ssg/recipes/tag/${split[1]}`)
    } else {
      router.push(`/ssg/recipes/${item.value}`)
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
