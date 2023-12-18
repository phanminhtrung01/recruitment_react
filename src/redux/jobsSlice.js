import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const today = dayjs();

const initialState = {
    value: {
        jobs: [],
        jobsSelected: [],
        currentJob: {
            jobApplyId: '',
            status: 'Đang chờ duyệt',
        },
        tabFilter: 'wait-approve',
        levelFilter: {
            key: 'level_1',
            value: 'Xét duyệt đầu vào',
        },
        jobsFilter: {
            mode: '',
            value: '',
            data: [],
        },
    },
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState: initialState,
    reducers: {
        setJobs: (state, action) => {
            state.value = {
                ...state.value,
                jobs: [action.payload, ...state.value.jobs],
            };
        },
        updateJobs: (state, action) => {
            state.value.jobs = state.value.jobs.map((job) => {
                if (job.jobApplyId === action.payload.jobApplyId) {
                    return action.payload;
                }
                return job;
            });
        },
        setJobsSelected: (state, action) => {
            state.value = {
                ...state.value,
                jobsSelected: action.payload,
            };
        },
        setJobsSelectedFromEmpty: (state, action) => {
            state.value = {
                ...state.value,
                jobsSelected: [action.payload, ...state.value.jobsSelected],
            };
        },
        resetJobsSelected: (state, action) => {
            state.value.jobsSelected = initialState.value.jobsSelected;
        },
        setTabFilter: (state, action) => {
            state.value = {
                ...state.value,
                tabFilter: action.payload,
            };
        },
        setLevelFilter: (state, action) => {
            state.value = {
                ...state.value,
                levelFilter: action.payload,
            };
        },
        setCurrentJob: (state, action) => {
            state.value = {
                ...state.value,
                currentJob: action.payload,
            };
        },

        resetCurrentJob: (state) => {
            state.value.currentJob = initialState.value.currentJob;
        },
        setCurrentPostNameJob: (state, action) => {
            state.value.currentPost = {
                ...state.value.currentPost,
                nameJob: action.payload,
            };
        },
        setJobsFromEmpty: (state, action) => {
            state.value = {
                ...state.value,
                jobs: action.payload,
            };
        },
        setJobsFilter: (state, action) => {
            state.value = {
                ...state.value,
                jobsFilter: action.payload,
            };
        },
        setJobsFilterMode: (state, action) => {
            state.value = {
                ...state.value,
                jobsFilter: {
                    ...state.value.jobsFilter,
                    mode: action.payload,
                },
            };
        },
        setJobsFilterValue: (state, action) => {
            state.value = {
                ...state.value,
                jobsFilter: {
                    ...state.value.jobsFilter,
                    value: action.payload,
                },
            };
        },
        setJobsFilterData: (state, action) => {
            state.value = {
                ...state.value,
                jobsFilter: {
                    ...state.value.jobsFilter,
                    data: action.payload,
                },
            };
        },
    },
});

export const {
    setJobs,
    updateJobs,
    setJobsSelected,
    setTabFilter,
    setLevelFilter,
    setCurrentJob,
    resetCurrentJob,
    setCurrentPostNameJob,
    setJobsFromEmpty,
    setJobsFilter,
    setJobsFilterMode,
    setJobsFilterValue,
    setJobsFilterData,
    setJobsSelectedFromEmpty,
    resetJobsSelected,
} = jobsSlice.actions;
export default jobsSlice.reducer;
