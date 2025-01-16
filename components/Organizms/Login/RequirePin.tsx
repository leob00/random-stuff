import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserPin } from 'lib/backend/api/aws/models/apiGatewayModels'
import { ReactNode, useEffect, useReducer, useRef } from 'react'
import EnterPinDialog from './EnterPinDialog'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenterStack from 'components/Atoms/CenterStack'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import CreatePinDialog from './CreatePinDialog'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { usePolling } from 'hooks/usePolling'
dayjs.extend(relativeTime)

interface Model {
  showPinCreate: boolean
  isPinExpired: boolean
  showPinEntry: boolean
  pinExpirationDate: string
}

const RequirePin = ({ minuteDuration = 5, enablePolling = true, children }: { minuteDuration?: number; enablePolling: boolean; children: ReactNode }) => {
  const pollingItervalMs = 60000 // 1 minute
  const { start: startPoller, stop: stopPoller, pollCounter, isStopped } = usePolling(pollingItervalMs, 100, true)

  const { authProfile: profile, setProfile, fetchProfilePassive } = useUserController()

  const missingPin = profile === null || !profile.pin

  const isPinExpired = missingPin || needsPinEntry(minuteDuration, profile?.pin)
  const defaultModel: Model = {
    showPinCreate: missingPin,
    isPinExpired: isPinExpired,
    showPinEntry: isPinExpired,
    pinExpirationDate: !missingPin ? dayjs(profile.pin!.lastEnterDate).add(minuteDuration, 'minutes').format() : dayjs().format(),
  }
  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const handleClosePinEntry = () => {
    setModel({ ...model, showPinEntry: false, showPinCreate: false })
  }

  const handlePinValidated = async (pin: UserPin) => {
    stopPoller()

    const newProfile = { ...profile! }

    newProfile.pin = pin
    await setProfile(newProfile)

    await putUserProfile(newProfile)
    setModel({
      ...model,
      showPinEntry: false,
      isPinExpired: false,
      showPinCreate: false,
      pinExpirationDate: dayjs().add(minuteDuration, 'minutes').format(),
    })
    startPoller()
  }

  useEffect(() => {
    const fn = async () => {
      const m = { ...model }
      const p = await fetchProfilePassive()
      if (!p) {
        setProfile(null)
      }
      if (!p || m.isPinExpired) {
        setModel({ ...model, isPinExpired: true, showPinEntry: true })
        stopPoller()
        return
      }

      if (enablePolling) {
        if (isStopped) {
          startPoller()
        }
        const newModel = { ...model }
        const shouldEnterPin = needsPinEntry(minuteDuration, p.pin)
        newModel.isPinExpired = shouldEnterPin
        newModel.showPinEntry = shouldEnterPin
        setModel(newModel)
      } else {
        const shouldEnterPin = needsPinEntry(minuteDuration, p.pin)
        setModel({ ...model, isPinExpired: shouldEnterPin, showPinEntry: shouldEnterPin })
      }
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollCounter])

  return (
    <>
      {profile ? (
        <>
          {model.showPinCreate ? (
            <CreatePinDialog show={model.showPinCreate} userProfile={profile} onConfirm={handlePinValidated} onCancel={handleClosePinEntry} />
          ) : (
            <>
              {model.showPinEntry ? (
                <>
                  <EnterPinDialog show={model.showPinEntry} userProfile={profile} onConfirm={handlePinValidated} onCancel={handleClosePinEntry} />
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
export const needsPinEntry = (minuteDuration: number, pin?: UserPin) => {
  if (!pin) {
    return true
  }

  const expDt = dayjs(pin.lastEnterDate).add(minuteDuration, 'minute')
  return expDt.isBefore(dayjs())
}
export default RequirePin
