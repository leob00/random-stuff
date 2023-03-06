import dayjs from 'dayjs'
import { useUserController } from 'hooks/userController'
import { UserPin, UserProfile } from 'lib/backend/api/aws/apiGateway'
import React, { ReactNode } from 'react'
import EnterPinDialog from './EnterPinDialog'

const RequirePin = ({ minuteDuration = 20, children }: { minuteDuration?: number; children: ReactNode }) => {
  const intervalRef = React.useRef<NodeJS.Timer | null>(null)
  const needsPin = (profile: UserProfile) => {
    const pin = profile.pin!
    return dayjs(pin.lastEnterDate).add(minuteDuration, 'minutes').isBefore(dayjs())
  }
  const userController = useUserController()
  const [showPinEntry, setShowPinEntry] = React.useState(needsPin(userController.authProfile!))
  const [userProfile, setUserProfile] = React.useState(userController.authProfile!)

  const handlePinValidated = (pin: UserPin) => {
    const p = { ...userController.authProfile! }
    p.pin = pin
    userController.setProfile(p)
    setUserProfile(p)
    setShowPinEntry(false)
  }
  React.useEffect(() => {
    const duration = minuteDuration * 1000 * 60
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!showPinEntry) {
          const enterPin = needsPin(userController.authProfile!)
          setShowPinEntry(enterPin)
          //clearInterval(intervalRef.current)
        }
      }, 10000)
    }
  }, [showPinEntry])

  return (
    <>{showPinEntry ? <EnterPinDialog show={showPinEntry} userProfile={userProfile} onConfirm={handlePinValidated} onCancel={() => {}} /> : <>{children}</>}</>
  )
}

export default RequirePin
