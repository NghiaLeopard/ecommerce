// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import users from 'src/stores/user'
import auth from 'src/stores/auth'
import role from 'src/stores/roles'
import city from 'src/stores/city'

export const store = configureStore({
  reducer: {
    users,
    auth,
    role,
    city
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
