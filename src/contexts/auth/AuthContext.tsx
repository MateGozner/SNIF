'use client'

import { createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useLogin, useLogout } from '@/hooks/auth/useAuth'
import { AuthContextType } from '@/lib/types/auth'
import { LocationDto } from '@/lib/types/location'


const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, user, setAuth, removeAuth } = useAuthStore()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const login = async (email: string, password: string, location?: LocationDto) => {
    try {
      const response = await loginMutation.mutateAsync({ email, password, location })
      setAuth(response.token, {
        id: response.id,
        email: response.email,
        name: response.name,
        location: response.location
        
      })
      router.push('/')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
      removeAuth()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      removeAuth()
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading: loginMutation.isPending || logoutMutation.isPending,
      user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)