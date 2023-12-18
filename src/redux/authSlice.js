import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: '', roleUI: '', roleDB: '', accessToken: '' },
};

const authSlide = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setRoleUI: (state, action) => {
            return {
                ...state,
                value: { ...state.value, roleUI: action.payload },
            };
        },
        setRoleDB: (state, action) => {
            return {
                ...state,
                value: { ...state.value, roleDB: action.payload },
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
        resetAuth: (state) => {
            state.value = initialState.value;
        },
    },
});

export const { setRoleUI, setRoleDB, loginE, setAccessToken, resetAuth } =
    authSlide.actions;
export default authSlide.reducer;
