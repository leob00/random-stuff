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
  userPr1ofile: UserProfile
  pollingCounter: number
}

export const needsPinEntry = (profile: UserProfile, minuteDuration: number, logExpiration: boolean = false) => {
  const pin = profile.pin!
  const isExpired = dayjs(pin.lastEnterDate).add(minuteDuration, 'minutes').isBefore(dayjs())
  if (isExpired) {
  } else {
    if (logExpiration) {
      console.log(`pin will expire in ${dayjs(pin.lastEnterDate).add(minuteDuration, 'minutes').from(dayjs())}`)
    }
  }
  return isExpired
}

const RequirePin = ({
  minuteDuration = 20,
  onPinValidated,
  enablePolling,
  children,
}: {
  minuteDuration?: number
  onPinValidated?: () => void
  enablePolling?: boolean
  children: ReactNode
}) => {
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const userController = useUserController()
  const isPinExpired = needsPinEntry(userController.authProfile!, minuteDuration)
  const defaultModel: Model = {
    isPinExpired: isPinExpired,
    showPinEntry: isPinExpired,
    userPr1ofile: userController.authProfile!,
    pollingCounter: 0,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const startPolling = () => {
    // console.log('polling: ', counter)
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const newModel = { ...model }
    if (!newModel.isPinExpired) {
      timeOutRef.current = setTimeout(() => {
        if (userController.authProfile) {
          let newCounter = newModel.pollingCounter + 1
          if (newCounter >= 50) {
            newCounter = 0
          }
          const shouldEnterPin = needsPinEntry(userController.authProfile, minuteDuration, newCounter % 2 === 0)
          newModel.isPinExpired = shouldEnterPin
          newModel.showPinEntry = shouldEnterPin
          if (!shouldEnterPin) {
            newModel.pollingCounter = newCounter
          } else {
            console.log('pin expired')
          }
          setModel(newModel)
        }
      }, 20000)
    } else {
      setModel({ ...model, isPinExpired: true })
      console.log('polling paused.')
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current)
      }
    }
  }

  const handlePinValidated = (pin: UserPin) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const p = { ...userController.authProfile! }
    p.pin = pin
    userController.setProfile(p)
    setModel({ ...model, userPr1ofile: p, showPinEntry: false, isPinExpired: false, pollingCounter: 0 })
    onPinValidated?.()
  }

  React.useEffect(() => {
    if (enablePolling) {
      startPolling()
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
          <EnterPinDialog
            show={model.showPinEntry}
            userProfile={model.userPr1ofile}
            onConfirm={handlePinValidated}
            onCancel={() => setModel({ ...model, showPinEntry: false })}
          />
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
