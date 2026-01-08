import { Box, IconButton, Stack, Typography } from '@mui/material'
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
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box>
          {searchSettings && searchSettings.allowSearch && (
            <>
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
            </>
          )}
        </Box>
        <Box flexGrow={1}>
          <Typography textAlign={'center'} variant='h6'>
            {title}
          </Typography>
        </Box>
        {onRefresh && (
          <Box>
            <ContextMenu items={menu} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SummaryTitle
