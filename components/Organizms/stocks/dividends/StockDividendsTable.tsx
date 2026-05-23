'use client'
import { Box, Breakpoint } from '@mui/material'
import { DataGrid, GridCallbackDetails, GridCellParams, GridColDef } from '@mui/x-data-grid'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import dayjs from 'dayjs'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import numeral from 'numeral'
import StockDividendDetails from './StockDividendDetails'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { useState } from 'react'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuote } from 'lib/backend/api/qln/qlnApi'
import StockListItem from '../StockListItem'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

export interface StockDividendItem {
  Symbol: string
  CompanyName: string
  Amount: number
  AnnualYield: number
  ExDate: string | null
  PaymentDate: string
  Frequency: string
}

type SelectedItemModel = {
  quote: StockQuote | null
  dividend: StockDividendItem
}

const StockDividendsTable = ({ data }: { data: StockDividendItem[] }) => {
  const { isLarge, isXLarge } = useViewPortSize()
  const columns = getColumnDef(isLarge || isXLarge)
  const { userProfile } = useProfileValidator()
  const [selectedItem, setSelectedItem] = useState<SelectedItemModel | null>(null)
  const options: DropdownItem[] = sortArray(data, ['Symbol'], ['asc']).map((m) => {
    return {
      text: `${m.Symbol}: ${m.CompanyName}`,
      value: m.Symbol,
    }
  })

  const handleCellClick = async (params: GridCellParams) => {
    const item = params.row as StockDividendItem
    const model: SelectedItemModel = {
      quote: await getStockQuote(item.Symbol),
      dividend: item,
    }
    setSelectedItem(model)
  }
  const handleSearchSelected = async (item: DropdownItem) => {
    const i = data.find((m) => m.Symbol == item.value)
    if (i) {
      const model: SelectedItemModel = {
        quote: await getStockQuote(item.value),
        dividend: i,
      }
      setSelectedItem(model)
    }
  }

  const rows = data.map((m) => {
    return { ...m, id: m.Symbol }
  })

  return (
    <>
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
        <>
          <InfoDialog title={`Dividends: ${selectedItem.dividend.Symbol}`} show={selectedItem != null} onCancel={() => setSelectedItem(null)} fullScreen>
            {selectedItem.quote && (
              <Box>
                <StockListItem item={selectedItem.quote} marketCategory='stocks' userProfile={userProfile} />
              </Box>
            )}
            <Box>
              <StockDividendDetails symbol={selectedItem.dividend.Symbol} showCompanyName={false} />
            </Box>
          </InfoDialog>
        </>
      )}
    </>
  )
}

function getColumnDef(isLarge: boolean) {
  const columns: GridColDef[] = [
    {
      flex: isLarge ? 1 : 0,
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
      field: 'PaymentDate',
      headerName: 'pay date',
      width: 135,
      editable: false,
      valueGetter: (value, row) => {
        return `${dayjs(value).format('MM/DD/YYYY')}`
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
