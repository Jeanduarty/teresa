import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthUser } from '../../shared/types/account-types'

interface AuthState {
  user: AuthUser | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    setSession(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    clearUser(state) {
      state.user = null
      state.token = null
    },
  },
})

export const { clearUser, setSession, setUser } = authSlice.actions
export const authReducer = authSlice.reducer
