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
import CreatePinDialog from './CreatePinDialog'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
dayjs.extend(relativeTime)

interface Model {
  showPinCreate: boolean
  isPinExpired: boolean
  showPinEntry: boolean
  userProfile: UserProfile | null
  pollingCounter: number
  pinExpirationdate: string
}

export const needsPinEntry = (minuteDuration: number, logExpiration: boolean = false, pin?: UserPin) => {
  if (!pin) {
    return true
  }

  const expDt = dayjs(pin.lastEnterDate).add(minuteDuration, 'minute')
  const isExpired = expDt.isBefore(dayjs())
  if (isExpired) {
  }
  return isExpired
}

const RequirePin = ({ minuteDuration = 5, enablePolling = true, children }: { minuteDuration?: number; enablePolling?: boolean; children: ReactNode }) => {
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const userController = useUserController()
  const profile = userController.authProfile

  const missingPin = profile === null || !profile.pin

  const isPinExpired = missingPin || needsPinEntry(minuteDuration, true, profile?.pin)
  const defaultModel: Model = {
    showPinCreate: missingPin,
    isPinExpired: isPinExpired,
    showPinEntry: isPinExpired,
    userProfile: profile,
    pollingCounter: 0,
    pinExpirationdate: !missingPin ? dayjs(profile.pin!.lastEnterDate).add(minuteDuration, 'minutes').format() : dayjs().format(),
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const startPolling = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (model.isPinExpired || !profile || !profile.pin) {
      return
    }

    timeOutRef.current = setTimeout(() => {
      const newModel = { ...model }
      let newCounter = newModel.pollingCounter
      if (newCounter >= 50) {
        newCounter = -1
      }
      if (newCounter === -1) {
        needsPinEntry(minuteDuration, true, newModel.userProfile?.pin)
        newCounter = 1
      } else {
        newCounter += 1
      }
      const shouldEnterPin = needsPinEntry(minuteDuration, newCounter === 0 || Math.abs(newCounter % 2) == 1, newModel.userProfile?.pin)
      newModel.isPinExpired = shouldEnterPin
      newModel.showPinEntry = shouldEnterPin
      newModel.pollingCounter = newCounter
      setModel(newModel)
    }, 10000)
  }

  const handleClosePinEntry = () => {
    setModel({ ...model, showPinEntry: false, showPinCreate: false })
  }

  const handlePinValidated = async (pin: UserPin) => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (!model.userProfile) {
      return
    }
    const newProfile = { ...model.userProfile, pin: pin }
    userController.setProfile(newProfile)

    putUserProfile(newProfile)
    setModel({
      ...model,
      userProfile: newProfile,
      showPinEntry: false,
      isPinExpired: false,
      showPinCreate: false,
      pollingCounter: 50000,
      pinExpirationdate: dayjs().add(minuteDuration, 'minutes').format(),
    })
    // setTimeout(() => {

    // }, 1000)
  }

  React.useEffect(() => {
    const fn = async () => {
      const m = { ...model }
      const p = await userController.fetchProfilePassive()
      if (!p) {
        return
      }
      if (m.isPinExpired) {
        return
      }
      if (enablePolling) {
        startPolling()
      } else {
        const shouldEnterPin = needsPinEntry(minuteDuration, true, m.userProfile?.pin)
        setModel({ ...model, isPinExpired: shouldEnterPin, showPinEntry: shouldEnterPin, userProfile: p })
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.pollingCounter])

  return (
    <>
      {model.userProfile ? (
        <>
          {model.showPinCreate ? (
            <CreatePinDialog show={model.showPinCreate} userProfile={model.userProfile} onConfirm={handlePinValidated} onCancel={handleClosePinEntry} />
          ) : (
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
                        <PrimaryButton text='enter pin' onClick={() => setModel({ ...model, showPinEntry: true })} />
                      </CenterStack>
                    </Box>
                  ) : (
                    <>{children}</>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default RequirePin
