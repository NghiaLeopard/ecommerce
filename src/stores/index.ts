// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import users from 'src/stores/user'
import auth from 'src/stores/auth'
import role from 'src/stores/roles'

export const store = configureStore({
  reducer: {
    users,
    auth,
    role
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
