import { createSlice } from '@reduxjs/toolkit';

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    isloading: false,
    error: '',
    posts: [],
  },
  reducers: {
    start: (state) => {
      state.isloading = true;
    },
    success: (state, action) => {
      state.isloading = false;
      state.error = false;
      state.posts = action.payload;
    },
    failure: (state, action) => {
      state.isloading = false;
      state.error = action.payload;
    },
    errSuccess: (state) => {
      state.error = '';
    },
    like: (state, action) => {
      const check = state?.posts?.findIndex(post => post._id === action.payload.id);
      const final = state?.posts[check]?.likes.findIndex(id => id === action.payload.userid);
      if (final !== -1) {
        state.posts[check].likes.splice(final, 1);
      }
      else {
        state.posts[check].likes.push(action.payload.userid);
      }

    }
  }


});

export const { start, success, failure, errSuccess, like } = postSlice.actions;




export default postSlice.reducer;
