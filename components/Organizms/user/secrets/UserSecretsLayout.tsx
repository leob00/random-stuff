import { Box, Button, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import AddGoalForm from 'components/Molecules/Forms/AddGoalForm'
import { CasinoBlueTransparent, CasinoGreenTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { constructUserGoalPk, constructUserGoalsKey, constructUserSecretSecondaryKey } from 'lib/backend/api/aws/util'
import { getUserGoals, getUserProfile, getUserSecrets, getUserTasks, putUserGoals, putUserGoalTasks } from 'lib/backend/csr/nextApiWrapper'
import { getGoalStats } from 'lib/backend/userGoals/userGoalUtil'
import { UserGoal, UserTask } from 'lib/models/userTasks'
import { getSecondsFromEpoch, getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, filter, orderBy } from 'lodash'
import React from 'react'
import GoalDetails from '../goals/GoalDetails'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { areObjectsEqual } from 'lib/util/objects'
import { replaceItemInArray } from 'lib/util/collections'
import GoalCharts from '../goals/GoalCharts'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import GoalsMenu from 'components/Molecules/Menus/GoalsMenu'
import PageWithGridSkeleton from 'components/Atoms/Skeletons/PageWithGridSkeleton'
import WarmupBox from 'components/Atoms/WarmupBox'
import { secretsArraySchema, UserSecret } from 'lib/backend/api/models/zModels'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import { searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'
import { useUserController } from 'hooks/userController'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import UserSecretLayout from './UserSecretLayout'

export interface UserGoalAndTask {
  goal: UserGoal
  tasks: UserTask[]
}

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
  goalsAndTasks: UserGoalAndTask[]
}
export function reorderTasks(list: UserTask[]) {
  const inProg = orderBy(
    filter(list, (e) => e.status === 'in progress'),
    ['status', 'dueDate'],
    ['desc', 'asc'],
  )
  const completed = orderBy(
    filter(list, (e) => e.status === 'completed'),
    ['dateCompleted'],
    ['desc'],
  )
  const result: UserTask[] = []
  result.push(...inProg)
  result.push(...completed)
  return result
}

interface Model {
  isLoading: boolean
  items: UserSecret[]
  selectedItem?: UserSecret
  key?: string
}

const UserSecretsLayout = ({ username }: { username: string }) => {
  const defaultModel: Model = {
    items: [],
    isLoading: true,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)
  const userController = useUserController()

  const loadData = async () => {
    const profile = await userController.refetchProfile()
    let result: UserSecret[] = []
    if (profile) {
      const dbResult = await getUserSecrets(profile.username)
      result = secretsArraySchema.parse(dbResult.map((item) => item.data))
    }
    return result
  }

  React.useEffect(() => {
    const fn = async () => {
      const result = await loadData()
      const profile = await userController.refetchProfile()
      setModel({
        ...model,
        key: profile?.secKey,
        isLoading: false,
        items: result,
        selectedItem: {
          id: '',
          title: '',
          notes: '',
          secret: myEncrypt(profile?.secKey!, 'testing encryption'),
        },
      })
      console.log('results: ', result)
    }
    fn()
  }, [])

  return (
    <ResponsiveContainer>
      {model.selectedItem && model.key && (
        <>
          <UserSecretLayout encKey={model.key} data={model.selectedItem} />
        </>
      )}
    </ResponsiveContainer>
  )
}

export default UserSecretsLayout
