import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    payAction: false
}

export const checkoutSlide = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutStatus: (state, action) => {
        state.value = action.payload
    },
    resetStatus: (state) => {
        state.value = initialState.payAction;
    },
  }
})

export const { setCheckoutStatus,resetStatus } = checkoutSlide.actions

export default checkoutSlide.reducer