import { Box, IconButton, Typography } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuRefresh from 'components/Molecules/Menus/ContextMenuRefresh'
import { SummarySearchSettings } from './summaryModels'
import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'

const SummaryTitle = ({
  title,
  onRefresh,
  searchSettings,
  setSearchSettings,
}: {
  title: string
  onRefresh?: () => void
  searchSettings?: SummarySearchSettings
  setSearchSettings?: (settings: SummarySearchSettings) => void
}) => {
  const menu: ContextMenuItem[] = [
    {
      fn: () => onRefresh?.(),
      item: <ContextMenuRefresh />,
    },
  ]

  return (
    <Box pb={2}>
      <Box display={'flex'} justifyContent={'space-between'} alignContent={'center'}>
        {!searchSettings && <Box minWidth={50}></Box>}

        <Box>
          {searchSettings && searchSettings.allowSearch && (
            <Box>
              {!searchSettings.searchOn && (
                <Box minWidth={60}>
                  <IconButton size='small' onClick={() => setSearchSettings?.({ ...searchSettings, searchOn: true })} color='primary'>
                    <SearchIcon fontSize='small' />
                  </IconButton>
                </Box>
              )}
              {searchSettings.searchOn && (
                <Box minWidth={60}>
                  <IconButton size='small' onClick={() => setSearchSettings?.({ ...searchSettings, searchOn: false })} color='primary'>
                    <SearchOffIcon fontSize='small' />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </Box>
        {/* {!searchSettings?.allowSearch && <Box sx={{ border: '1px solid blue' }} flexGrow={1}></Box>} */}
        <Box flexGrow={1} justifyContent={'center'} alignSelf={'center'}>
          <Typography textAlign={'center'} variant='h6'>
            {title}
          </Typography>
        </Box>
        <Box>{onRefresh && <ContextMenu items={menu} />}</Box>
      </Box>
    </Box>
  )
}

export default SummaryTitle
