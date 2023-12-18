import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
    value: {
        currentSelectPosition: {
            position: {
                positionId: '',
                name: '',
                descriptions: '',
            },
            amount: 0,
            comis: 0,
        },
        positions: [
            // {
            //     position: {
            //         positionId: '',
            //         name: '',
            //         descriptions: '',
            //     },
            //     amount: 0,
            // },
        ],
        name: '',
        date: {
            startDate: dayjs(),
            endDate: dayjs().add(1, 'day'),
        },
        oldApplicantsAllowed: false,
        contractAllowed: { index: [], contains: [] },
    },
};

const contractSlice = createSlice({
    name: 'contract',
    initialState: initialState,
    reducers: {
        setCurrentSelectPosition: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    currentSelectPosition: action.payload,
                },
            };
        },
        setCurrentPositionAmount: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    currentSelectPosition: {
                        ...state.value.currentSelectPosition,
                        amount: action.payload,
                    },
                },
            };
        },
        setCurrentPositionComis: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    currentSelectPosition: {
                        ...state.value.currentSelectPosition,
                        comis: action.payload,
                    },
                },
            };
        },
        setCurrentPosition: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    currentSelectPosition: {
                        ...state.value.currentSelectPosition,
                        position: action.payload,
                    },
                },
            };
        },
        setPositions: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    positions: [action.payload, ...state.value.positions],
                },
            };
        },
        setPositionsFromEmpty: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    positions: action.payload,
                },
            };
        },
        setName: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    name: action.payload,
                },
            };
        },
        setDate: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    date: action.payload,
                },
            };
        },
        setStartDate: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    date: {
                        ...state.value.date,
                        startDate: action.payload,
                    },
                },
            };
        },
        setEndDate: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    date: {
                        ...state.value.date,
                        endDate: action.payload,
                    },
                },
            };
        },
        setOldApplicantsAllowed: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    oldApplicantsAllowed: action.payload,
                },
            };
        },
        setContractAllowed: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    contractAllowed: action.payload,
                },
            };
        },
        setNameContract: (state, action) => {
            return {
                ...state,
                value: {
                    ...state.value,
                    name: action.payload,
                },
            };
        },
        resetContract: (state) => {
            state.value = initialState.value;
        },
    },
});

export const {
    setCurrentSelectPosition,
    setCurrentPositionAmount,
    setCurrentPositionComis,
    setCurrentPosition,
    setPositions,
    setPositionsFromEmpty,
    setName,
    setDate,
    setStartDate,
    setEndDate,
    setOldApplicantsAllowed,
    setContractAllowed,
    resetContract,
} = contractSlice.actions;

export default contractSlice.reducer;
