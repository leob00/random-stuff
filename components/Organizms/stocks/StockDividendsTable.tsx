import { Box } from '@mui/material'
import { DataGrid, GridCallbackDetails, GridCellParams, GridColDef, GridValueGetterParams, MuiEvent } from '@mui/x-data-grid'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import dayjs from 'dayjs'
import { apiConnection } from 'lib/backend/api/config'
import { StockDividendItem } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import React from 'react'
import StockDividendDetails from './dividends/StockDividendDetails'

const StockDividendsTable = ({ data }: { data: StockDividendItem[] }) => {
  const columns = getColumnDef()

  const [selectedItem, setSelectedItem] = React.useState<StockDividendItem | null>(null)

  const handleCellClick = async (params: GridCellParams, event: MuiEvent, details: GridCallbackDetails) => {
    const item = params.row as StockDividendItem
    setSelectedItem(item)
  }

  const rows = data.map((m) => {
    return { ...m, id: m.Symbol }
  })

  return (
    <>
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
          //disableColumnSelector
          // pageSizeOptions={[5]}
          // checkboxSelection
          // disableRowSelectionOnClick
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
      valueGetter: (params) => {
        return `${params.row.CompanyName} (${params.row.Symbol})`
      },
    },
    {
      field: 'AnnualYield',
      headerName: 'annual yield',
      width: 140,
      editable: false,
      valueGetter: (params) => {
        return `${numeral(params.value).format('0,0.000')}%`
      },
    },
    {
      field: 'Amount',
      headerName: 'amount',
      width: 90,
      editable: false,
      valueGetter: (params) => {
        return `$${numeral(params.value).format('0,0.000')}`
      },
    },
    {
      field: 'ExDate',
      headerName: 'ex date',
      width: 135,
      editable: false,
      valueGetter: (params) => {
        return `${dayjs(params.value).format('MM/DD/YYYY')}`
      },
    },
    {
      field: 'PaymentDate',
      headerName: 'pay date',
      width: 135,
      editable: false,
      valueGetter: (params) => {
        return `${dayjs(params.value).format('MM/DD/YYYY')}`
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

export default StockDividendsTable
