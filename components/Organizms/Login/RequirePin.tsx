import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React, { ReactNode } from 'react'
import EnterPinDialog from './EnterPinDialog'
import relativeTime from 'dayjs/plugin/relativeTime'
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
  const [counter, setCounter] = React.useState(0)

  const startPolling = () => {
    //console.log('polling started.')
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (!showPinEntry) {
      timeOutRef.current = setTimeout(() => {
        if (userController.authProfile) {
          let newCounter = counter + 1
          if (newCounter >= 50) {
            newCounter = 0
          }
          const shouldEnterPin = needsPinEntry(userController.authProfile, minuteDuration, newCounter % 2 === 0)
          setShowPinEntry(shouldEnterPin)
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
      }
    }
  }, [counter])

  return (
    <>{showPinEntry ? <EnterPinDialog show={showPinEntry} userProfile={userProfile} onConfirm={handlePinValidated} onCancel={() => {}} /> : <>{children}</>}</>
  )
}

export default RequirePin
