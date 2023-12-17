import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

export const actionProductSlice = createSlice({
  name: 'actionProduct',
  initialState,
  reducers: {
    setActionProduct: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setActionProduct } = actionProductSlice.actions

export default actionProductSlice.reducer