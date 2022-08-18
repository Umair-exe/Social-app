import { createSlice } from '@reduxjs/toolkit';


export const appSlice = createSlice({
   name: 'app',
   initialState: {
      isloading: false,
      error: null,
      searchedUsers: [],
      user: null,
      userPosts: [],
   },
   reducers: {
      start: (state) => {
         state.isloading = true;
      },
      responseCame: (state) => {
         state.isloading = false;
      },
      stop: (state, action) => {
         state.searchedUsers = action.payload;
         state.isloading = false;
      },
      fail: (state, action) => {
         state.isloading = false;
         state.error = action.payload
      },
      errorsucc: (state) => {
         state.error = '';
      },
      addFriend: (state, action) => {
         const index = state?.searchedUsers?.findIndex(user => user._id === action.payload.id);
         const finalIndex = state?.searchedUsers[index]?.followers?.indexOf(action.payload.userId);
         if (finalIndex !== -1) {
            state.searchedUsers[index].followers.splice(finalIndex, 1);
         }
         else {
            state.searchedUsers[index].followers.push(action.payload.userId);
         }
      },
      addFriendFromProfile: (state, action) => {
        
         const finalIndex = state?.user?.followers?.indexOf(action.payload.userId);
         if (finalIndex !== -1) {
            state.user.followers.splice(finalIndex, 1);
         }
         else {
            state.user.followers.push(action.payload.userId);
         }
      },
      userProfile: (state, action) => {
         state.user = action.payload.user;
         state.userPosts = action.payload.posts;
      },
      cleanProfile: (state, action) => {
         state.user = null;
         state.userPosts = [];
      }
   }
});

export const { start, stop, fail, errorsucc, addFriend, responseCame, userProfile, cleanProfile,addFriendFromProfile } = appSlice.actions;




export default appSlice.reducer;
