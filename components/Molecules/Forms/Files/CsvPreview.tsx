import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import Pager from 'components/Atoms/Pager'
import CopyableText from 'components/Atoms/Text/CopyableText'
import { useClientPager } from 'hooks/useClientPager'
import { useSwrHelper } from 'hooks/useSwrHelper'

type Row = {
  index: number
  values: string[]
}

export type CsvTableModel = {
  columns: string[]
  rows: Row[]
}

const CsvPreview = ({ url }: { url: string }) => {
  const dataFn = async () => {
    const fetchUrl = `/api/file?url=${encodeURIComponent(url)}`
    const resp = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(url) })
    const b = await resp.blob()
    const text = await b.text()
    const result: CsvTableModel = {
      columns: [],
      rows: [],
    }
    const lines = text.split('\n')

    if (lines.length > 0) {
      result.columns = lines[0].split(',').map((m) => m.replaceAll('"', ''))
      lines.forEach((line, index) => {
        if (index > 0) {
          const values = line.split(',').map((m) => m.replaceAll('"', ''))
          const parsed: string[] = []
          const row: Row = {
            index: index,
            values: [],
          }
          values.forEach((value) => {
            parsed.push(value)
          })
          row.values.push(...parsed)
          result.rows.push(row)
        }
      })
    }

    return result
  }
  const { data } = useSwrHelper(url, dataFn, { revalidateOnFocus: false })
  const pageSize = 25
  const { getPagedItems, setPage, pagerModel } = useClientPager(data?.rows ?? [], pageSize)
  const pagedItems = getPagedItems(data?.rows ?? [])
  const scroller = useScrollTop(0)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    scroller.scroll()
  }

  return (
    <Box>
      {data && (
        <Box>
          <ScrollableBox scroller={scroller}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {data.columns.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedItems.map((row) => (
                    <TableRow key={row.index}>{row.values.map((value, index) => value && <TableCell key={index}>{value}</TableCell>)}</TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ScrollableBox>
          <Pager
            pageCount={pagerModel.totalNumberOfPages}
            itemCount={pagedItems.length}
            itemsPerPage={pageSize}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={pagerModel.page}
            totalItemCount={pagerModel.totalNumberOfItems}
            showHorizontalDivider={false}
          />
        </Box>
      )}
    </Box>
  )
}

export default CsvPreview
