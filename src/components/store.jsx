import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './redux/CounterSlice'
import userReducer from './redux/userSlice'
import  cartProductReducer from './redux/cartProductSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    cartProduct: cartProductReducer,
  },
})