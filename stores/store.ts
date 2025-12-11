// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import developerReducer from './slices/developerSlice'

export const store = configureStore({
  reducer: {
    developer: developerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch