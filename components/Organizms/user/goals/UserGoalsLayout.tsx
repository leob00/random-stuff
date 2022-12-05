import { Box, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import { CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, putUserGoals, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal } from 'lib/models/userTasks'
import { getSecondsFromEpoch, getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'
import GoalDetails from './GoalDetails'

export interface UserGoalsModel {
  isLoading: boolean
  isSaving: boolean
  selectedGoal?: UserGoal
  goals: UserGoal[]
  username: string
  goalEditMode: boolean
  showConfirmDeleteGoal: boolean
}

const UserGoalsLayout = ({ username }: { username: string }) => {
  const defaultModel: UserGoalsModel = {
    goals: [],
    username: username,
    isLoading: true,
    goalEditMode: false,
    isSaving: false,
    showConfirmDeleteGoal: false,
  }
  const [model, setModel] = React.useReducer((state: UserGoalsModel, newState: UserGoalsModel) => ({ ...state, ...newState }), defaultModel)

  const loadGoals = async () => {
    const result = await getUserGoals(constructUserGoalsKey(username))
    result.forEach((g) => {
      if (!g.completePercent) g.completePercent = 0
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
    setModel({ ...model, goals: goals, selectedGoal: undefined, isLoading: false })
  }

  const handleGoalClick = (item: UserGoal) => {
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
    await putUserGoalTasks(model.selectedGoal?.id!, [], getSecondsFromEpoch())
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
    setModel({ ...model, isSaving: true })
    goal.dateModified = getUtcNow().format()
    //goal.stats = getGoalStats(goal)
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

  React.useEffect(() => {
    const fn = async () => {
      const goals = await loadGoals()
      //setGoalStats(goals)
      setModel({ ...model, goals: goals, isLoading: false })
    }
    fn()
  }, [])

  return (
    <Box>
      <ConfirmDeleteDialog
        show={model.showConfirmDeleteGoal}
        title={'confirm delete'}
        text={'Are you sure you want to delete this goal?'}
        onConfirm={handleYesDeleteGoal}
        onCancel={() => {
          setModel({ ...model, showConfirmDeleteGoal: false })
        }}
      />
      <Box py={2}>
        {!model.isLoading ? (
          <AddGoalForm goal={{}} onSubmit={handleEditGoalSubmit} />
        ) : (
          <>
            <Stack direction={'row'} spacing={1}>
              <TextSkeleton />
              <TextSkeleton />
            </Stack>
          </>
        )}
      </Box>
      <Box>
        {model.isLoading ? (
          <WarmupBox />
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
                  />
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
