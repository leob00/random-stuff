import { Box, Typography, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { CasinoRedTransparent, RedDarkMode } from 'components/themes/mainTheme'
import { UserGoal, UserGoalStats } from 'lib/models/userTasks'
import React from 'react'

const UserGoalsList = ({ data, onShowEdit }: { data: UserGoal[]; onShowEdit: (item: UserGoal) => void }) => {
  const theme = useTheme()
  const redColor = theme.palette.mode === 'dark' ? RedDarkMode : CasinoRedTransparent
  return (
    <>
      {data.map((item, i) => (
        <Box key={item.id}>
          <Box>
            <ListHeader text={item.body ?? ''} item={item} onClicked={onShowEdit} />
            {item.stats && (
              <Box pl={2} pb={2}>
                <>
                  <Box>
                    <ReadOnlyField label={`tasks`} val={`${Number(item.stats.completed) + Number(item.stats.inProgress)}`} />
                    <ReadOnlyField label={`completed`} val={`${item.stats.completed}`} />
                    <ReadOnlyField label={`in progress`} val={`${item.stats.inProgress}`} />
                  </Box>
                  {item.stats.pastDue > 0 && <Typography variant='body2' pt={1} color={redColor}>{`past due: ${item.stats.pastDue}`}</Typography>}
                </>
              </Box>
            )}
          </Box>
          {/* </ListItemContainer> */}
          {i < data.length - 1 && <HorizontalDivider />}
        </Box>
      ))}
    </>
  )
}

export default UserGoalsList
