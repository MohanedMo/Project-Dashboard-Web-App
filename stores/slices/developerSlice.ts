// features/developer/developerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DeveloperRole = 'DEVELOPER' | 'MANAGER' | 'ADMIN'

export interface DeveloperState {
  id: string | null
  name: string
  email: string
  role: DeveloperRole | ''
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: DeveloperState = {
  id: null,
  name: '',
  email: '',
  role: '',
  token: null,
  isAuthenticated: false,
  isLoading: false,
}

const developerSlice = createSlice({
  name: 'developer',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    login(
      state,
      action: PayloadAction<{
        id: string
        name: string
        email: string
        role: DeveloperRole
        token: string
      }>
    ) {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.role = action.payload.role
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
    },
    setDeveloper(
      state,
      action: PayloadAction<{
        id: string
        name: string
        email: string
        role: DeveloperRole
      }>
    ) {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.role = action.payload.role
    },
    updateDeveloperProfile(
      state,
      action: PayloadAction<Partial<Pick<DeveloperState, 'name' | 'email' | 'role'>>>
    ) {
      return { ...state, ...action.payload }
    },
    logout() {
      return initialState
    },
  },
})

export const { setLoading, login, setDeveloper, updateDeveloperProfile, logout } =
  developerSlice.actions

export default developerSlice.reducer