import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: '', role: '', info: {} },
};

const infoUserSlide = createSlice({
    name: 'infoUser',
    initialState: initialState,
    reducers: {
        updateAll: (state, action) => {
            state.value = action.payload;
        },
        updateUsername: (state, action) => {
            state.value.username = action.payload;
        },
        updateRole: (state, action) => {
            state.value.role = action.payload;
        },
        updateInfo: (state, action) => {
            state.value.info = action.payload;
        },
        resetInfoUser: (state) => {
            state.value = initialState.value;
        },
    },
});

export const { updateAll, updateUsername, updateRole, updateInfo, resetInfoUser } =
    infoUserSlide.actions;
export default infoUserSlide.reducer;
