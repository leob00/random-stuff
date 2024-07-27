import { Box } from '@mui/material'
import { DataGrid, GridCallbackDetails, GridCellParams, GridColDef, MuiEvent } from '@mui/x-data-grid'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import dayjs from 'dayjs'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import numeral from 'numeral'
import React from 'react'
import StockDividendDetails from './StockDividendDetails'

export interface StockDividendItem {
  Symbol: string
  CompanyName: string
  Amount: number
  AnnualYield: number
  ExDate: string | null
  PaymentDate: string
  Frequency: string
}

const StockDividendsTable = ({ data }: { data: StockDividendItem[] }) => {
  const columns = getColumnDef()

  const [selectedItem, setSelectedItem] = React.useState<StockDividendItem | null>(null)
  const options: DropdownItem[] = sortArray(data, ['Symbol'], ['asc']).map((m) => {
    return {
      text: `${m.Symbol}: ${m.CompanyName}`,
      value: m.Symbol,
    }
  })

  const handleCellClick = async (params: GridCellParams, event: MuiEvent, details: GridCallbackDetails) => {
    const item = params.row as StockDividendItem

    setSelectedItem(item)
  }
  const handleSearchSelected = (item: DropdownItem) => {
    const i = data.find((m) => m.Symbol == item.value)
    if (i) {
      setSelectedItem(i)
    }
  }

  const rows = data.map((m) => {
    return { ...m, id: m.Symbol }
  })

  return (
    <>
      <ScrollIntoView enabled={true} margin={-28} />
      <Box py={1}>
        <StaticAutoComplete options={options} onSelected={handleSearchSelected} placeholder={'search in list'} />
      </Box>
      <Box sx={{ height: 420, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          onCellClick={handleCellClick}
          pageSizeOptions={[5]}
        />
      </Box>
      {selectedItem && (
        <InfoDialog title={`Dividends: ${selectedItem.Symbol}`} show={selectedItem != null} onCancel={() => setSelectedItem(null)} fullScreen>
          <Box>
            <StockDividendDetails symbol={selectedItem.Symbol} />
          </Box>
        </InfoDialog>
      )}
    </>
  )
}

function getColumnDef() {
  const columns: GridColDef[] = [
    {
      //flex: 1,
      field: 'Symbol',
      headerName: 'company',
      width: 250,
      editable: false,
      valueGetter: (value, row) => {
        return `${row.CompanyName} (${row.Symbol})`
      },
    },
    {
      field: 'AnnualYield',
      headerName: 'annual yield',
      width: 140,
      editable: false,
      valueGetter: (value, row) => {
        return `${numeral(value).format('0,0.000')}%`
      },
    },
    {
      field: 'Amount',
      headerName: 'amount',
      width: 90,
      editable: false,
      valueGetter: (value, row) => {
        return `$${numeral(value).format('0,0.000')}`
      },
    },
    {
      field: 'ExDate',
      headerName: 'ex date',
      width: 135,
      editable: false,
      valueGetter: (value, row) => {
        return `${dayjs(value).format('MM/DD/YYYY')}`
      },
    },
    {
      field: 'PaymentDate',
      headerName: 'pay date',
      width: 135,
      editable: false,
      valueGetter: (value, row) => {
        return `${dayjs(value).format('MM/DD/YYYY')}`
      },
    },
    {
      field: 'Frequency',
      headerName: 'frequency',
      width: 135,
      editable: false,
    },
  ]
  return columns
}

function filterList() {}

export default StockDividendsTable
