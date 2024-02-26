import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { StockDividendItem } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import React from 'react'

const StockDividendsTable = ({ data }: { data: StockDividendItem[] }) => {
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
  const rows = data.map((m) => {
    return { ...m, id: m.Symbol }
  })

  return (
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
        pageSizeOptions={[5]}
        // pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default StockDividendsTable
