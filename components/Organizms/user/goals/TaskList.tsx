import { Box, Stack, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredSubtitle from 'components/Atoms/Text/CenteredSubtitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddTaskForm from 'components/Molecules/Forms/AddTaskForm'
import { UserTask } from 'lib/models/userTasks'
import React from 'react'

const TaskList = ({ tasks }: { tasks: UserTask[] }) => {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    setIsLoading(false)
  }, [])
  return (
    <>
      <Box py={2}>
        <Typography variant='subtitle1'>Tasks</Typography>
      </Box>
      {isLoading ? (
        <WarmupBox />
      ) : (
        <>
          <Box my={1}>
            <AddTaskForm task={{}} onSubmit={function (data: UserTask): void {}} />
          </Box>
          {tasks.map((item, i) => (
            <Box key={i} textAlign='left'>
              <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
                <Typography>{item.body}</Typography>
              </Stack>
              {i < tasks.length - 1 && <HorizontalDivider />}
            </Box>
          ))}
        </>
      )}
    </>
  )
}

export default TaskList
