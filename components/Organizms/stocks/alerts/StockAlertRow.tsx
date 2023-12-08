import { Alert, Box, TableCell, TableRow, Typography } from '@mui/material'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import dayjs from 'dayjs'
import { StockAlertSubscription } from 'lib/backend/api/models/zModels'
import React from 'react'

const StockAlertRow = ({ sub }: { sub: StockAlertSubscription }) => {
  const menuItems: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: (arg?: unknown) => {
        console.log(arg)
      },
    },
  ]
  return (
    <TableRow>
      <TableCell colSpan={10}>
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box>
              <Typography variant='h5'>{`${sub.company} (${sub.symbol})`}</Typography>
            </Box>
            <Box>
              <ContextMenu items={menuItems} />
            </Box>
          </Box>
          {sub.triggers.map((trigger) => (
            <Box key={trigger.typeId} pt={1} display={'flex'} gap={1} flexDirection={'column'}>
              <Box>
                <Typography variant='body2'>{`${trigger.typeDescription}`}</Typography>
              </Box>
              <Box>
                <Typography variant='body2'>{`target: ${trigger.target}%`}</Typography>
              </Box>
              <Box>
                {trigger.message && (
                  <>
                    <AlertWithHeader
                      severity='success'
                      header={`${dayjs(trigger.lastExecutedDate).format('MM/DD/YYYY hh:mm a')}`}
                      text={`${trigger.message}`}
                    />
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default StockAlertRow
