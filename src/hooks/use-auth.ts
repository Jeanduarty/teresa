import { useEffect } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { clearUser, setSession, setUser } from '../store/slices/auth-session-slice'
import { queryClient } from '../shared/lib/query-client'
import { authService } from '../services/auth-service'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type {
  AuthUser,
  LoginInput,
  SignupInput,
  VerifySignupSecretInput,
} from '../shared/types/account-types'

export function useAuthSession() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const query = useQuery<AuthUser | null, Error>({
    queryKey: ['session'],
    queryFn: authService.getSession,
  })

  useEffect(() => {
    if (query.data !== undefined) {
      if (query.data) {
        dispatch(setUser(query.data))
      } else if (user) {
        dispatch(clearUser())
      }
    }
  }, [dispatch, query.data, user])

  return {
    ...query,
    user: query.data ?? user,
    isLoading: query.isLoading,
  }
}

export function useLogin() {
  const dispatch = useAppDispatch()

  return useMutation<{ user: AuthUser; token: string }, Error, LoginInput>({
    mutationFn: authService.login,
    onSuccess: (session) => {
      dispatch(setSession(session))
      queryClient.setQueryData<AuthUser | null>(['session'], session.user)
    },
  })
}

export function useSignup() {
  const dispatch = useAppDispatch()

  return useMutation<{ user: AuthUser; token: string }, Error, SignupInput>({
    mutationFn: authService.signup,
    onSuccess: (session) => {
      dispatch(setSession(session))
      queryClient.setQueryData<AuthUser | null>(['session'], session.user)
    },
  })
}

export function useVerifySignupSecret() {
  return useMutation<boolean, Error, VerifySignupSecretInput>({
    mutationFn: authService.verifySignupSecret,
  })
}

export function useLogout() {
  const dispatch = useAppDispatch()

  return useMutation<boolean, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(clearUser())
      queryClient.setQueryData<AuthUser | null>(['session'], null)
    },
  })
}
