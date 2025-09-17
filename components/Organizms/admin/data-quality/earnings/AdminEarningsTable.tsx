import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { StockEarning, serverDeleteFetch, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { AdminEarningsModel } from './AdminEarningsWrapper'
import { Dispatch, Fragment, useState } from 'react'
import FormDatePicker from 'components/Molecules/Forms/ReactHookForm/FormDatePicker'
import FormNumericTextField from 'components/Molecules/Forms/ReactHookForm/FormNumericTextField'
import numeral from 'numeral'
import dayjs from 'dayjs'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { weakEncryptBase64 } from 'lib/backend/encryption/useEncryptor'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'

type Model = {
  year: number
  searchResults: StockEarning[]
  recordHash: string
}

const AdminEarningsTable = ({ model, setModel, onRefresh }: { model: AdminEarningsModel; setModel: Dispatch<AdminEarningsModel>; onRefresh: () => void }) => {
  const { claims } = useSessionStore()
  const claim = claims.find((m) => m.type === 'qln')
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const results: Model[] = []
  const years = Array.from(new Set(model.searchResults.map((m) => m.Year!)))
  years.forEach((year) => {
    const searchResults = model.searchResults.filter((m) => m.Year === year)
    results.push({
      year: year,
      searchResults: searchResults,
      recordHash: weakEncryptBase64(JSON.stringify(searchResults)),
    })
  })

  const handleSetSelectedItem = (item: StockEarning) => {
    setModel({ ...model, selectedItem: item })
  }
  const handleCancelSelectedItem = () => {
    setModel({ ...model, selectedItem: null })
  }
  const handleUpdateDate = (dt: string | null) => {
    if (model.selectedItem) {
      setModel({ ...model, selectedItem: { ...model.selectedItem, ReportDate: dt } })
    }
  }
  const handleUpdateActual = (val: string | null) => {
    if (model.selectedItem) {
      setModel({ ...model, selectedItem: { ...model.selectedItem, ActualEarnings: val ? Number(val) : null } })
    }
  }
  const handleUpdateEstimated = (val: string | null) => {
    if (model.selectedItem) {
      setModel({ ...model, selectedItem: { ...model.selectedItem, EstimatedEarnings: val ? Number(val) : null } })
    }
  }
  const handleSaveSelectedItem = async () => {
    if (model.selectedItem) {
      if (claim) {
        const body: StockEarning[] = [{ ...model.selectedItem }]
        await serverPostFetch(
          {
            body: body,
          },
          `/AdminEarnings?Token=${claim.token}`,
        )

        onRefresh()
      }
    }
  }

  const handleYesDelete = async () => {
    setShowConfirmDelete(false)
    if (model.selectedItem) {
      if (claim) {
        const body: StockEarning[] = [{ ...model.selectedItem }]
        await serverDeleteFetch(
          {
            body: body,
          },
          `/AdminEarnings?Token=${claim.token}`,
        )

        onRefresh()
      }
    }
  }

  const handleAdd = (year: number) => {
    const dt = dayjs(new Date(year, 0, 1)).format()
    if (model.stockQuote) {
      const newItem: StockEarning = {
        Symbol: model.stockQuote.Symbol,
        ReportDate: dt,
        Year: year,
        Quarter: 1,
        RecordId: model.searchResults.length * -1,
      }
      let newSearchResults = [...model.searchResults]
      newSearchResults.unshift(newItem)
      setModel({ ...model, searchResults: newSearchResults, selectedItem: newItem })
    }
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: `solid ${CasinoBlueTransparent} 1px` }}>
              <TableCell>
                <Box pb={2}>
                  <Typography>Report Date</Typography>
                </Box>
              </TableCell>
              <TableCell>Actual</TableCell>
              <TableCell>Estimated</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((yearItem) => (
              <Fragment key={yearItem.recordHash}>
                <TableRow>
                  <TableCell colSpan={10} sx={{ borderBottom: 'none' }}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Box>
                        <Typography variant='h6' fontWeight={600}>
                          {yearItem.year}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          size='small'
                          onClick={() => {
                            handleAdd(yearItem.year)
                          }}
                        >
                          add
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                {yearItem.searchResults.map((item) => (
                  <TableRow
                    key={`${item.RecordId}-${item.ReportDate}-${item.ActualEarnings}`}
                    sx={{
                      border: model.selectedItem && model.selectedItem.RecordId === item.RecordId ? `solid ${CasinoBlueTransparent} 1px` : 'unset',
                    }}
                  >
                    {model.selectedItem && model.selectedItem.RecordId === item.RecordId ? (
                      <>
                        <TableCell sx={{ borderBottom: 'none', borderTop: 'none' }}>
                          <Box py={1} pl={1}>
                            <FormDatePicker value={model.selectedItem.ReportDate ?? null} onDateSelected={handleUpdateDate} />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <FormNumericTextField
                            value={item.ActualEarnings !== undefined && item.ActualEarnings !== null ? numeral(item.ActualEarnings).format('0,0.000') : ''}
                            onChanged={handleUpdateActual}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <FormNumericTextField
                            value={
                              item.EstimatedEarnings !== undefined && item.EstimatedEarnings !== null ? numeral(item.EstimatedEarnings).format('0,0.000') : ''
                            }
                            onChanged={handleUpdateEstimated}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <Box py={1} pl={1}>
                            <Typography>{dayjs(item.ReportDate).format('MM/DD/YYYY')}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {item.ActualEarnings !== undefined && item.ActualEarnings !== null ? numeral(item.ActualEarnings).format('0,0.000') : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {item.EstimatedEarnings !== undefined && item.EstimatedEarnings !== null ? numeral(item.EstimatedEarnings).format('0,0.000') : ''}
                          </Typography>
                        </TableCell>
                      </>
                    )}

                    <TableCell sx={{ borderBottom: model.selectedItem && model.selectedItem.RecordId === item.RecordId ? 'none' : 'default' }}>
                      {!model.selectedItem || model.selectedItem.RecordId !== item.RecordId ? (
                        <Button
                          size='small'
                          onClick={() => {
                            handleSetSelectedItem(item)
                          }}
                        >
                          edit
                        </Button>
                      ) : (
                        <Box display={'flex'} flexDirection={'row'} gap={1}>
                          <Button size='small' onClick={handleCancelSelectedItem}>
                            cancel
                          </Button>
                          <Button
                            size='small'
                            onClick={() => {
                              handleSaveSelectedItem()
                            }}
                          >
                            save
                          </Button>
                          <Button size='small' onClick={() => setShowConfirmDelete(true)}>
                            delete
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showConfirmDelete && (
        <ConfirmDeleteDialog
          show={showConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          title='Delete Earning'
          text='Are you sure you want to delete this record?'
          onConfirm={() => {
            handleYesDelete()
          }}
        ></ConfirmDeleteDialog>
      )}
    </>
  )
}

export default AdminEarningsTable
