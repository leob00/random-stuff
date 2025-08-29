import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export interface UserProfileValidatorModel {
  isValidating: boolean
  userProfile: UserProfile | null
}

const UserProfileValidatorContext = createContext<UserProfileValidatorModel | null>(null)

export function UserProfileValidatorProvider({ children }: { children: ReactNode }) {
  const { userProfile, isValidating } = useProfileValidator()

  return <UserProfileValidatorContext value={{ userProfile, isValidating }}>{children}</UserProfileValidatorContext>
}

export function useUserProfileValidatorContext() {
  const context = useContext(UserProfileValidatorContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
