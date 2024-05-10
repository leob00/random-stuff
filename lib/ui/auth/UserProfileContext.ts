import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { createContext, useContext } from 'react'

export type UserProfileAuth = {
  userProfile: UserProfile | null
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}
const defaultState: UserProfileAuth = {
  userProfile: null,
  setUserProfile: () => null,
}

export const UserProfileContext = createContext<UserProfileAuth>(defaultState)
export const useUserProfileContext = () => useContext(UserProfileContext)
