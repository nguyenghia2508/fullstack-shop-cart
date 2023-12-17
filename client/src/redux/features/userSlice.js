import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: {} }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    },
    resetUser: (state) => {
      state.value = initialState.value;
    },
  }
})

export const { setUser,resetUser  } = userSlice.actions

export default userSlice.reducer