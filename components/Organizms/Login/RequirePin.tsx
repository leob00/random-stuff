import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React, { ReactNode } from 'react'
import EnterPinDialog from './EnterPinDialog'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenterStack from 'components/Atoms/CenterStack'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
dayjs.extend(relativeTime)

interface Model {
  isPinExpired: boolean
  showPinEntry: boolean
  userProfile: UserProfile
  pollingCounter: number
  pinExpirationdate: string
}

export const needsPinEntry = (profile: UserProfile, minuteDuration: number, logExpiration: boolean = false) => {
  const pin = profile.pin!
  const isExpired = dayjs(pin.lastEnterDate).add(minuteDuration, 'minutes').isBefore(dayjs())
  if (isExpired) {
  } else {
    if (logExpiration) {
      console.log(`pin will expire ${dayjs(pin.lastEnterDate).add(minuteDuration, 'minutes').from(dayjs())}`)
    }
  }
  return isExpired
}

const RequirePin = ({ minuteDuration = 20, enablePolling, children }: { minuteDuration?: number; enablePolling?: boolean; children: ReactNode }) => {
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const userController = useUserController()
  const isPinExpired = needsPinEntry(userController.authProfile!, minuteDuration)
  const defaultModel: Model = {
    isPinExpired: isPinExpired,
    showPinEntry: isPinExpired,
    userProfile: userController.authProfile!,
    pollingCounter: 0,
    pinExpirationdate: dayjs().add(minuteDuration, 'minutes').format(),
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const startPolling = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const newModel = { ...model }
    let newCounter = newModel.pollingCounter
    if (newCounter === -1) {
      needsPinEntry(newModel.userProfile, minuteDuration, true)
      newCounter = 1
    } else {
      newCounter += 1
    }
    if (!newModel.isPinExpired) {
      timeOutRef.current = setTimeout(() => {
        console.log('polling: ', newCounter)
        const shouldEnterPin = needsPinEntry(newModel.userProfile, minuteDuration, newCounter === 0 || Math.abs(newCounter % 2) == 1)
        newModel.isPinExpired = shouldEnterPin
        newModel.showPinEntry = shouldEnterPin
        if (!shouldEnterPin) {
          newModel.pollingCounter = newCounter
        } else {
          console.log('pin expired')
        }
        setModel(newModel)
      }, 20000)
    } else {
      setModel({ ...model, isPinExpired: true })
      console.log('polling paused.')
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current)
      }
    }
  }

  const handleClosePinEntry = () => {
    console.log('hide dialog')
    setModel({ ...model, showPinEntry: false })
  }

  const handlePinValidated = (pin: UserPin) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const p = { ...model.userProfile }
    p.pin = pin

    userController.setProfile(p)

    setModel({
      ...model,
      userProfile: p,
      showPinEntry: false,
      isPinExpired: false,
      pollingCounter: -1,
      pinExpirationdate: dayjs().add(minuteDuration, 'minutes').format(),
    })
  }

  React.useEffect(() => {
    //console.log('useEffect called')
    const m = { ...model }
    if (enablePolling) {
      if (!m.isPinExpired && !m.showPinEntry) {
        startPolling()
      }
    } else {
      if (userController.authProfile) {
        const shouldEnterPin = needsPinEntry(userController.authProfile, minuteDuration)
        setModel({ ...model, isPinExpired: shouldEnterPin, showPinEntry: shouldEnterPin })
      }
    }
  }, [model.pollingCounter])

  return (
    <>
      {model.showPinEntry ? (
        <>
          <EnterPinDialog show={model.showPinEntry} userProfile={model.userProfile} onConfirm={handlePinValidated} onCancel={handleClosePinEntry} />
        </>
      ) : (
        <>
          {model.isPinExpired ? (
            <Box p={2} border={`1px solid ${CasinoGrayTransparent}`} borderRadius={2}>
              <CenteredHeader title='Pin required' description='please enter your pin to proceed.' />
              <CenterStack>
                <SecondaryButton text='enter pin' onClick={() => setModel({ ...model, showPinEntry: true })} />
              </CenterStack>
            </Box>
          ) : (
            <>{children}</>
          )}
        </>
      )}
    </>
  )
}

export default RequirePin
