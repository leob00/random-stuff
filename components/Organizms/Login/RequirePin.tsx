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
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
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
  const lastDt = dayjs(pin.lastEnterDate)
  const expDt = dayjs(pin.lastEnterDate).add(minuteDuration, 'minute')
  //console.log(`last lastDt, expDt: ${lastDt}, ${expDt}`)
  const isExpired = expDt.isBefore(dayjs())
  //console.log('pin expired: ', isExpired)
  if (isExpired) {
    console.log('expired: ', isExpired)
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
  const profile = userController.authProfile!
  const isPinExpired = needsPinEntry(userController.authProfile!, minuteDuration)
  const defaultModel: Model = {
    isPinExpired: isPinExpired,
    showPinEntry: isPinExpired,
    userProfile: userController.authProfile!,
    pollingCounter: 0,
    pinExpirationdate: dayjs(profile.pin!.lastEnterDate).add(minuteDuration, 'minutes').format(),
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const startPolling = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (model.isPinExpired) {
      return
    }

    //console.log(`polling: isPinExpired, showPinEntry ${newModel.isPinExpired}, ${newModel.showPinEntry}`)
    timeOutRef.current = setTimeout(() => {
      const newModel = { ...model }
      let newCounter = newModel.pollingCounter
      if (newCounter >= 50) {
        newCounter = -1
      }
      if (newCounter === -1) {
        needsPinEntry(newModel.userProfile, minuteDuration, true)
        newCounter = 1
      } else {
        newCounter += 1
      }
      //console.log('polling: ', newCounter)
      const shouldEnterPin = needsPinEntry(newModel.userProfile, minuteDuration, newCounter === 0 || Math.abs(newCounter % 2) == 1)
      //console.log('shouldEnterPin: ', shouldEnterPin)
      newModel.isPinExpired = shouldEnterPin
      newModel.showPinEntry = shouldEnterPin
      newModel.pollingCounter = newCounter
      setModel(newModel)
    }, 10000)
  }

  const handleClosePinEntry = () => {
    console.log('hide dialog')
    setModel({ ...model, showPinEntry: false })
  }

  const handlePinValidated = async (pin: UserPin) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    const newProfile = { ...model.userProfile, pin: pin }
    userController.setProfile(newProfile)

    console.log(`pin validated. `)

    await putUserProfile(newProfile)
    setModel({
      ...model,
      userProfile: newProfile,
      showPinEntry: false,
      isPinExpired: false,
      pollingCounter: 50000,
      pinExpirationdate: dayjs().add(minuteDuration, 'minutes').format(),
    })
    // setTimeout(() => {

    // }, 1000)
  }

  React.useEffect(() => {
    const m = { ...model }
    if (m.isPinExpired) {
      return
    }
    if (enablePolling) {
      //console.log('polling started')
      startPolling()
    } else {
      const shouldEnterPin = needsPinEntry(m.userProfile, minuteDuration)
      setModel({ ...model, isPinExpired: shouldEnterPin, showPinEntry: shouldEnterPin })
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
