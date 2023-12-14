import { TableCell, TableHead, TableRow } from '@mui/material'
import React from 'react'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import numeral from 'numeral'

const TableHeaderWithSearchWithinList = ({ count, handleSearched }: { count: number; handleSearched: (text: string) => void }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell colSpan={10}>
          <CenterStack>
            <SearchWithinList onChanged={handleSearched} text={`search in ${numeral(count).format('###,###')} alerts`} />
          </CenterStack>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default TableHeaderWithSearchWithinList
