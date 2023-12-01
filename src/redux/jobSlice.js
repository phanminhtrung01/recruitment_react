import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        job: {},
        jobAll: [],
        contractDetails: {},
        apply: {},
        courses: [],
        positions: [],
        jobs: [],
    },
};

const jobSlice = createSlice({
    name: 'job',
    initialState: initialState,
    reducers: {
        setJob: (state, action) => {
            state.value.job = action.payload;
        },
        setJobAll: (state, action) => {
            state.value.jobAll = action.payload;
        },
        setContractDetails: (state, action) => {
            state.value.contractDetails = action.payload;
        },
        setApply: (state, action) => {
            state.value.apply = action.payload;
        },
        setCourses: (state, action) => {
            state.value.courses = action.payload;
        },
        setPositions: (state, action) => {
            state.value.positions = action.payload;
        },
    },
});

export const {
    setJob,
    setJobAll,
    setContractDetails,
    setApply,
    setCourses,
    setPositions,
} = jobSlice.actions;
export default jobSlice.reducer;
