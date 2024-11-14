import SearchIcon from '@mui/icons-material/Search'
import SearchOff from '@mui/icons-material/SearchOff'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Stack, IconButton, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import { TaskModel } from '../TaskList'

const TaskListHeader = ({
  model,
  handleToggleSearch,
  handleDownloadToFile,
  handleSearched,
}: {
  model: TaskModel
  handleToggleSearch: () => void
  handleDownloadToFile: () => void
  handleSearched: (text: string) => void
}) => {
  return (
    <>
      <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <Box>
            <IconButton size='small' color='primary' onClick={handleToggleSearch}>
              {!model.showSearch ? <SearchIcon fontSize='small' /> : <SearchOff fontSize='small' />}
            </IconButton>
            {!model.showSearch && (
              <DefaultTooltip text={'export to file'}>
                <IconButton size='small' color='primary' onClick={handleDownloadToFile}>
                  <OpenInNewIcon fontSize='small' />
                </IconButton>
              </DefaultTooltip>
            )}
          </Box>

          <Box>
            {model.showSearch && (
              <Stack>
                <SearchWithinList text={'search tasks'} onChanged={handleSearched} />
              </Stack>
            )}
          </Box>
        </Box>
        <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
          <Typography variant='caption'>complete</Typography>
        </Stack>
      </Stack>
      <HorizontalDivider />
    </>
  )
}

export default TaskListHeader
