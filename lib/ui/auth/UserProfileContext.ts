import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { createContext, useContext } from 'react'

export type UserProfileAuth = {
  userProfile: UserProfile | null
}
const defaultState: UserProfileAuth = {
  userProfile: null,
}

export const UserProfileContext = createContext<UserProfileAuth>(defaultState)
export const useUserProfileContext = () => useContext(UserProfileContext)
