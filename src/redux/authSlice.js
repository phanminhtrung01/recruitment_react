import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: '', role: '', accessToken: '' },
};

const authSlide = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        roleE: (state, action) => {
            return {
                ...state,
                value: { ...state.value, role: action.payload },
            };
        },
        loginE: (state, action) => {
            return { ...state, value: { ...state.value, ...action.payload } };
        },
        setAccessToken: (state, action) => {
            return {
                ...state,
                value: { ...state.value, accessToken: action.payload },
            };
        },
    },
});

export const { roleE, loginE, setAccessToken } = authSlide.actions;
export default authSlide.reducer;
