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

export const needsPinEntry = (profile: UserProfile, minuteDuration: number, logExpiration: boolean = false) => {
  const pin = profile.pin!
  const isExpired = dayjs(pin.lastEnterDate).add(minuteDuration, 'minutes').isBefore(dayjs())
  if (isExpired) {
    console.log('pin expired')
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
  const [showPinEntry, setShowPinEntry] = React.useState(needsPinEntry(userController.authProfile!, minuteDuration))
  const [userProfile, setUserProfile] = React.useState(userController.authProfile!)
  const [pinExpired, setPinExpired] = React.useState(needsPinEntry(userController.authProfile!, minuteDuration))
  const [counter, setCounter] = React.useState(0)

  const startPolling = () => {
    // console.log('polling: ', counter)
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (!pinExpired) {
      timeOutRef.current = setTimeout(() => {
        if (userController.authProfile) {
          let newCounter = counter + 1
          if (newCounter >= 50) {
            newCounter = 0
          }
          const shouldEnterPin = needsPinEntry(userController.authProfile, minuteDuration, newCounter % 2 === 0)
          setShowPinEntry(shouldEnterPin)
          setPinExpired(shouldEnterPin)
          setCounter(newCounter)
        }
      }, 20000)
    } else {
      console.log('polling paused.')
    }
  }

  const handlePinValidated = (pin: UserPin) => {
    const p = { ...userController.authProfile! }
    p.pin = pin
    userController.setProfile(p)
    setUserProfile(p)
    setShowPinEntry(false)
    setPinExpired(false)
    setCounter(50000)
    onPinValidated?.()
  }
  React.useEffect(() => {
    if (enablePolling) {
      startPolling()
    } else {
      if (userController.authProfile) {
        const shouldEnterPin = needsPinEntry(userController.authProfile, minuteDuration)
        setShowPinEntry(shouldEnterPin)
        setPinExpired(shouldEnterPin)
      }
    }
  }, [counter])

  return (
    <>
      {showPinEntry ? (
        <>
          <EnterPinDialog show={showPinEntry} userProfile={userProfile} onConfirm={handlePinValidated} onCancel={() => setShowPinEntry(false)} />
        </>
      ) : (
        <>
          {pinExpired ? (
            <Box p={2} border={`1px solid ${CasinoGrayTransparent}`} borderRadius={2}>
              <CenteredHeader title='Pin required' description='please enter your pin to proceed.' />
              <CenterStack>
                <SecondaryButton text='enter pin' onClick={() => setShowPinEntry(true)} />
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
