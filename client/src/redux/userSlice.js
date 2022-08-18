import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isloading: false,
    error: '',
    isUser: false,
    user: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isloading = true;
    },
    loginSuccess: (state, action) => {
      state.isloading = false;
      state.error = false
      state.isUser = true;
      state.user = action.payload
    },

    loginFailure: (state, action) => {
      state.isloading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isUser = false;
      state.user = null;
    },
    removeFriend: (state, action) => {
      const index = state.user.following.findIndex(id => id === action.payload)
      if (index !== -1) {
        state.user.following.splice(index, 1);
      }
      else {
        state.user.following.push(action.payload);
      }

    },
    errorSuccess: (state) => {
      state.error = '';
    },
    uploadProfile: (state, action) => {
      state.isloading = false;
      state.error = false
      state.user = action.payload;
    },

  }


});

export const { loginStart, loginSuccess, loginFailure, logout, errorSuccess, removeFriend, uploadProfile } = userSlice.actions;




export default userSlice.reducer;
