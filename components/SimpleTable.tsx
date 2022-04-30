import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

function YTable({ rows, headers, width }: { rows: string[][]; headers: string[]; width: number }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: width }} size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            {headers.map((header, ix) => (
              <TableCell key={ix} align='center'>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, ix) => (
            <TableRow key={ix}>
                {row.map((r, ix2)=>(<TableCell key={`${ix}a${ix2}`} align='center'>{r}</TableCell>))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default YTable
