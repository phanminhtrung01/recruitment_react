import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
    value: {
        positions: [],
        contract: {},
        data: {
            nameJob: '',
            datePost: dayjs().format('DD/MM/YYYY'),
            dateExpire: '',
            viewed: 0,
            submitted: 0,
            gender: '',
            age: '',
            workAddress: '',
            salary: {
                min: '',
                max: '',
            },
            description: '',
            required: '',
            benefit: '',
            contactJobDTO: {
                email: '',
                phoneNumber: '',
            },
            benchmarkJobDTO: {
                minMark: '',
                maxMark: '',
            },
        },
        isMerge: true,
    },
};

const postApplySlice = createSlice({
    name: 'postApply',
    initialState: initialState,
    reducers: {
        updatePositions: (state, action) => {
            state.value.positions = action.payload;
        },
        changeAmountByContractDetailsId: (state, action) => {
            const { contractDetailsId, amount } = action.payload;

            const positions = state.value.positions;
            const index = positions.findIndex(
                (position) => position.contractDetailsId === contractDetailsId,
            );

            if (index !== -1) {
                state.value.positions[index].amount = amount;
            }
        },
        updateContract: (state, action) => {
            state.value.contract = action.payload;
        },
        updateData: (state, action) => {
            state.value.data = action.payload;
        },
        updateNameJob: (state, action) => {
            state.value.data.nameJob = action.payload;
        },
        updateDatePost: (state, action) => {
            state.value.data.datePost = action.payload;
        },
        updateDateExpire: (state, action) => {
            state.value.data.dateExpire = action.payload;
        },
        updateViewed: (state, action) => {
            state.value.data.viewed = action.payload;
        },
        updateSubmitted: (state, action) => {
            state.value.data.submitted = action.payload;
        },
        updateGender: (state, action) => {
            state.value.data.gender = action.payload;
        },
        updateAge: (state, action) => {
            state.value.data.age = action.payload;
        },
        updateWorkAddress: (state, action) => {
            state.value.data.workAddress = action.payload;
        },
        updateSalary: (state, action) => {
            state.value.data.salary = action.payload;
        },
        updateDescription: (state, action) => {
            state.value.data.description = action.payload;
        },
        updateRequired: (state, action) => {
            state.value.data.required = action.payload;
        },
        updateBenefit: (state, action) => {
            state.value.data.benefit = action.payload;
        },
        updateContactJobDTO: (state, action) => {
            state.value.data.contactJobDTO = action.payload;
        },
        updateBenchmarkJobDTO: (state, action) => {
            state.value.data.benchmarkJobDTO = action.payload;
        },
        resetPostApply: (state) => {
            state.value = initialState.value;
        },
        updateIsMerge: (state, action) => {
            state.value.isMerge = action.payload;
        },
    },
});

export const {
    updatePositions,
    updateContract,
    updateData,
    updateNameJob,
    updateDatePost,
    updateDateExpire,
    updateViewed,
    updateSubmitted,
    updateGender,
    updateAge,
    updateWorkAddress,
    updateSalary,
    updateDescription,
    updateRequired,
    updateContactJobDTO,
    updateBenchmarkJobDTO,
    resetPostApply,
    updateBenefit,
    changeAmountByContractDetailsId,
    updateIsMerge,
} = postApplySlice.actions;
export default postApplySlice.reducer;
