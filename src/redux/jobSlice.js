import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        job: {},
        classesPostStudent: [],
        classesPosition: [],
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
        setClassesPostStudent: (state, action) => {
            state.value.classesPostStudent = action.payload;
        },
        setClassesPosition: (state, action) => {
            state.value.classesPosition = action.payload;
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
    setClassesPostStudent,
    setClassesPosition,
    setJobAll,
    setContractDetails,
    setApply,
    setCourses,
    setPositions,
} = jobSlice.actions;
export default jobSlice.reducer;
