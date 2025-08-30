import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialAuth = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null')
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuth,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }
});




export const { setAuth, clearAuth } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  }
});

export default store;
