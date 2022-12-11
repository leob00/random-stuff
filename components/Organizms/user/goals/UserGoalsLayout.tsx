import { Box, Button, Divider, Grid, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import {
  CasinoBlue,
  CasinoBlueTransparent,
  CasinoGrayTransparent,
  CasinoGreen,
  CasinoGreenTransparent,
  CasinoMoreBlackTransparent,
  CasinoRedTransparent,
} from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserTasks, putUserGoals, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getSecondsFromEpoch, getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'
import GoalDetails from './GoalDetails'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import WidgetsIcon from '@mui/icons-material/Widgets'
import MenuIcon from '@mui/icons-material/Menu'
import { ContentCut, ContentCopy, ContentPaste, Cloud, Close } from '@mui/icons-material'
import CachedIcon from '@mui/icons-material/Cached'
import BarChartIcon from '@mui/icons-material/BarChart'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import BasicBarChart from 'components/Atoms/Charts/BasicBarChart'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'

export interface UserGoalsModel {
  isLoading: boolean
  isSaving: boolean
  selectedGoal?: UserGoal
  goals: UserGoal[]
  username: string
  goalEditMode: boolean
  showConfirmDeleteGoal: boolean
  showAddGoalForm: boolean
  barChart?: BarChart
}

const UserGoalsLayout = ({ username }: { username: string }) => {
  const defaultModel: UserGoalsModel = {
    goals: [],
    username: username,
    isLoading: true,
    goalEditMode: false,
    isSaving: false,
    showConfirmDeleteGoal: false,
    showAddGoalForm: false,
  }
  const [model, setModel] = React.useReducer((state: UserGoalsModel, newState: UserGoalsModel) => ({ ...state, ...newState }), defaultModel)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleShowMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const loadGoals = async () => {
    const result = await getUserGoals(constructUserGoalsKey(username))
    result.forEach((g) => {
      if (!g.completePercent) {
        g.completePercent = 0
      }
    })
    return orderBy(result, ['dateModified'], ['desc'])
  }

  const handleEditGoalSubmit = async (item: UserGoal) => {
    setModel({ ...model, isLoading: true })
    let goals = cloneDeep(model).goals
    if (!item.id) {
      item.id = constructUserGoalPk(username)
      item.dateCreated = getUtcNow().format()
    }
    item.dateModified = getUtcNow().format()
    goals.push(item)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, selectedGoal: undefined, isLoading: false, showAddGoalForm: false })
  }

  const handleGoalClick = async (item: UserGoal) => {
    setModel({ ...model, selectedGoal: item })
  }
  const handleCloseSelectedGoal = () => {
    setModel({ ...model, selectedGoal: undefined, goalEditMode: false })
  }
  const handleDeleteGoal = (item: UserGoal) => {
    setModel({ ...model, selectedGoal: item, showConfirmDeleteGoal: true })
  }
  const handleYesDeleteGoal = async () => {
    setModel({ ...model, isLoading: true, showConfirmDeleteGoal: false })
    const goalList = filter(model.goals, (e) => e.id !== model.selectedGoal?.id)
    await putUserGoals(constructUserGoalsKey(username), goalList)
    await putUserGoalTasks(model.username, model.selectedGoal?.id!, [], getSecondsFromEpoch())
    setModel({ ...model, goals: goalList, selectedGoal: undefined, isLoading: false, showConfirmDeleteGoal: false })
  }

  const handleGoalBodyChange = (text: string) => {
    if (model.selectedGoal) {
      const goal = model.selectedGoal
      goal.body = text
      setModel({ ...model, selectedGoal: goal })
    }
  }
  const handleSetGoalEditMode = (isEdit: boolean) => {
    setModel({ ...model, goalEditMode: isEdit })
  }

  const saveGoal = async (goal: UserGoal) => {
    setModel({ ...model, isSaving: true, isLoading: true, selectedGoal: undefined })
    goal.dateModified = getUtcNow().format()
    let goals = filter(cloneDeep(model.goals), (e) => e.id !== goal!.id)
    goals.push(goal)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, isSaving: false, isLoading: false, goalEditMode: false, selectedGoal: goal })
  }

  const handleSubmitGoalChanges = async () => {
    let goal = cloneDeep(model.selectedGoal)
    if (goal) {
      await saveGoal(goal)
    }
  }
  const handleDueDateChange = async (text?: string) => {
    if (model.selectedGoal) {
      const goal = cloneDeep(model.selectedGoal)
      goal.dueDate = text
      setModel({ ...model, selectedGoal: goal })
    }
  }
  const handelGoalDetailsLoaded = (goal: UserGoal, tasks: UserTask[]) => {
    //console.log('goal detail loaded')
    goal.stats = getGoalStats(tasks)
    setModel({ ...model, selectedGoal: goal })
    const div = document.getElementById('goalDetailsLink')
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const handleRefrehGoals = async () => {
    setModel({ ...model, isLoading: true })
    let goals = await loadGoals()
    setModel({ ...model, goals: goals, goalEditMode: false, selectedGoal: undefined, barChart: undefined })
  }

  const handleShowCharts = async () => {
    setModel({ ...model, isLoading: true })
    const result = await getUserTasks(model.username)
    //console.log(result.length)

    const tasks: UserTask[] = []
    result.forEach((g) => {
      const m = JSON.parse(g.data) as unknown as UserTask[]
      //console.log(m)
      tasks.push(...m)
    })
    //console.log(tasks.length)
    const inProg = filter(tasks, (e) => e.status !== 'completed').length
    const comp = filter(tasks, (e) => e.status === 'completed').length
    const barChart: BarChart = {
      colors: [CasinoBlueTransparent, CasinoGreenTransparent],
      labels: ['in progress', 'completed'],
      numbers: [inProg, comp],
      borderColors: ['black'],
    }
    setModel({ ...model, isLoading: false, barChart: barChart, selectedGoal: undefined })
  }

  React.useEffect(() => {
    const fn = async () => {
      const goals = await loadGoals()
      setModel({ ...model, goals: goals, isLoading: false })
    }
    fn()
  }, [])

  return (
    <Box>
      <ConfirmDeleteDialog
        show={model.showConfirmDeleteGoal}
        title={'confirm delete'}
        text={`Are you sure you want to delete goal: ${model.selectedGoal?.body}?`}
        onConfirm={handleYesDeleteGoal}
        onCancel={() => {
          setModel({ ...model, showConfirmDeleteGoal: false })
        }}
      />
      <Box py={2}>
        <Stack display={'flex'} direction={'row'} justifyContent={'left'} alignItems={'left'}>
          <Box>
            <LinkButton2
              onClick={() => {
                setModel({ ...model, showAddGoalForm: !model.showAddGoalForm })
              }}
            >
              add goal
            </LinkButton2>
          </Box>
          <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'flex-end'}>
            <Button
              size='small'
              id='basic-button'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleShowMenu}
            >
              {/* <RefreshOutlinedIcon color='secondary' fontSize='small' /> */}

              <MenuIcon color='secondary' fontSize='small' />
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuList>
                <MenuItem
                  onClick={() => {
                    handleCloseMenu()
                    handleRefrehGoals()
                  }}
                >
                  <ListItemIcon>
                    <CachedIcon color='secondary' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>refresh</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleCloseMenu()
                    handleShowCharts()
                  }}
                >
                  <ListItemIcon>
                    <BarChartIcon color='secondary' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>view charts</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
        {!model.isLoading ? (
          <>
            {model.barChart && (
              <Box py={2}>
                <HorizontalDivider />

                <Stack display={'flex'} direction={'row'} justifyContent={'flex-end'}>
                  <Button
                    onClick={() => {
                      setModel({ ...model, barChart: undefined })
                    }}
                    sx={{}}
                  >
                    <Close />
                  </Button>
                </Stack>
                <CenteredTitle title='All Tasks By Status' />
                <Box>
                  <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
                    <Grid item xs={12} md={4}>
                      <Box>
                        <BasicPieChart barChart={model.barChart} title={''} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Box>
                        <BasicBarChart barChart={model.barChart} title={''} />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
            {model.showAddGoalForm && (
              <Box pt={1}>
                <AddGoalForm goal={{}} onSubmit={handleEditGoalSubmit} />
              </Box>
            )}
          </>
        ) : (
          <>
            <Stack direction={'row'} spacing={1}>
              <TextSkeleton />
            </Stack>
          </>
        )}
      </Box>
      <Box>
        {model.isLoading ? (
          <>
            <WarmupBox />
            <Box py={2}>
              <TextSkeleton />
            </Box>
            <Box py={2}>
              <TextSkeleton />
            </Box>
            <Box py={2}>
              <TextSkeleton />
            </Box>
            <Box py={2}>
              <TextSkeleton />
            </Box>
            <Box py={2}>
              <TextSkeleton />
            </Box>
          </>
        ) : (
          <>
            {model.goals.length > 0 && (
              <Stack direction='row' pt={2} pb={1} justifyContent='left' alignItems='left'>
                <Typography textAlign={'left'} variant='body2'>
                  Name
                </Typography>
                <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                  <Typography variant='body2'>Progress</Typography>
                </Stack>
              </Stack>
            )}
            <HorizontalDivider />

            {model.goals.map((item, i) => (
              <Box key={i}>
                <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
                  <LinkButton2
                    id={model.selectedGoal && model.selectedGoal.id === item.id ? 'goalDetailsLink' : undefined}
                    onClick={() => {
                      handleGoalClick(item)
                    }}
                  >
                    <Typography textAlign={'left'} variant='subtitle1'>
                      {item.body}
                    </Typography>
                  </LinkButton2>
                  {item.completePercent !== undefined && (
                    <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                      <ProgressBar value={item.completePercent} toolTipText={`${item.completePercent}% complete`} width={80} />
                    </Stack>
                  )}
                </Stack>
                {item.dueDate && <Typography variant='body2'>{`due: ${dayjs(item.dueDate).format('MM/DD/YYYY hh:mm A')}`}</Typography>}
                {item.stats && <Typography variant='body2'>{`completed: ${item.stats.completed}`}</Typography>}
                {item.stats && <Typography variant='body2'>{`in progress: ${item.stats.inProgress}`}</Typography>}
                {item.stats && item.stats.pastDue > 0 && (
                  <LinkButton2
                    onClick={() => {
                      handleGoalClick(item)
                    }}
                  >
                    <Typography variant='body2' color={CasinoRedTransparent}>{`past due: ${item.stats.pastDue}`}</Typography>
                  </LinkButton2>
                )}

                {model.selectedGoal && model.selectedGoal.id === item.id && (
                  <>
                    <Button id='goalDetailsStart' sx={{ display: 'none' }}></Button>
                    <GoalDetails
                      model={model}
                      goalId={item.id!}
                      handleGoalBodyChange={handleGoalBodyChange}
                      handleCloseSelectedGoal={handleCloseSelectedGoal}
                      handleDeleteGoal={handleDeleteGoal}
                      handleDueDateChange={handleDueDateChange}
                      handleSubmitGoalChanges={handleSubmitGoalChanges}
                      handleSetGoalEditMode={handleSetGoalEditMode}
                      handleModifyGoal={saveGoal}
                      onLoaded={handelGoalDetailsLoaded}
                    />
                  </>
                )}
                {i < model.goals.length - 1 && <HorizontalDivider />}
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  )
}

export default UserGoalsLayout
