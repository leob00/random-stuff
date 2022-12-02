import { Box, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import TextSkeleton from 'components/Atoms/Skeletons/TextSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import { constructUserGoalPk, constructUserGoalsKey } from 'lib/backend/api/aws/util'
import { getUserGoals, putUserGoals } from 'lib/backend/csr/nextApiWrapper'
import { UserGoal } from 'lib/models/userTasks'
import { getUtcNow } from 'lib/util/dateUtil'
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
    console.log('due date: ', item.dueDate)
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
    let goals = filter(cloneDeep(model.goals), (e) => e.id !== goal!.id)
    goals.push(goal)
    goals = orderBy(goals, ['dateModified'], ['desc'])
    await putUserGoals(constructUserGoalsKey(model.username), goals)
    setModel({ ...model, goals: goals, selectedGoal: goal, isSaving: false })
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
      await saveGoal(goal)
    }
  }

  React.useEffect(() => {
    const fn = async () => {
      setModel({ ...model, goals: await loadGoals(), isLoading: false })
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
        <HorizontalDivider />
        {model.isLoading ? (
          <WarmupBox />
        ) : (
          <>
            {model.goals.map((item, i) => (
              <Box key={i}>
                <Stack direction='row' py={'3px'} justifyContent='left' alignItems='left'>
                  <LinkButton
                    onClick={() => {
                      handleGoalClick(item)
                    }}
                  >
                    <Typography textAlign={'left'} variant='subtitle1'>
                      {item.body}
                    </Typography>
                  </LinkButton>
                  {item.completePercent !== undefined && item.completePercent > 0 && (
                    <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end' alignContent={'flex-end'} alignItems={'center'}>
                      <ProgressBar value={item.completePercent ?? 0} />
                    </Stack>
                  )}
                </Stack>

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
