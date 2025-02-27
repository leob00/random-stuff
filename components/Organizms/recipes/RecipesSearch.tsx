import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import router from 'next/router'

const RecipesSearch = ({ autoComplete }: { autoComplete: DropdownItem[] }) => {
  const handleSelected = (item: DropdownItem) => {
    if (item.value.includes('tag:')) {
      const split = item.value.split(':')
      router.push(`/ssg/recipes/tag/${split[1]}`)
      console.log('tag: ', split[1])
    } else {
      router.push(`/ssg/recipes/${item.value}`)
    }
  }
  return (
    <StaticAutoComplete
      options={autoComplete}
      placeholder={`search ${autoComplete.length} recipes`}
      onSelected={handleSelected}
      fullWidth
      disableClearable={false}
    />
  )
}

export default RecipesSearch
