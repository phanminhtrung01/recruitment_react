import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const today = dayjs();

const initialState = {
    value: {
        contracts: [],
        enterprise: null,
        currentContract: {
            contractId: '',
            name: '',
            createDate: today.format(DEFAULT_DATE_FORMAT),
            effectiveDate: today.add(1, 'day').format(DEFAULT_DATE_FORMAT),
            terminationDate: today.add(2, 'day').format(DEFAULT_DATE_FORMAT),
            status: 'Đang chờ duyệt',
        },
        tabFilter: 'wait-approve',
        contractsFilter: {
            mode: '',
            value: '',
            data: [],
        },
    },
};

const contractsSlice = createSlice({
    name: 'contracts',
    initialState: initialState,
    reducers: {
        setContracts: (state, action) => {
            state.value = {
                ...state.value,
                contracts: [action.payload, ...state.value.contracts],
            };
        },
        updateEnterprise: (state, action) => {
            const enterprisePayload = action.payload;
            const enterpriseState = state.value.enterprise;
            if (
                enterprisePayload?.enterpriseId !==
                enterpriseState?.enterpriseId
            ) {
                state.value.enterprise = action.payload;
            }
        },
        setTabFilter: (state, action) => {
            state.value = {
                ...state.value,
                tabFilter: action.payload,
            };
        },
        setCurrentContract: (state, action) => {
            state.value = {
                ...state.value,
                currentContract: action.payload,
            };
        },
        resetCurrentContract: (state) => {
            state.value.currentContract = initialState.value.currentContract;
        },
        setCurrentContractName: (state, action) => {
            state.value.currentContract = {
                ...state.value.currentContract,
                name: action.payload,
            };
        },
        setCurrentContractCreateDate: (state, action) => {
            state.value.currentContract = {
                ...state.value.currentContract,
                createDate: action.payload,
            };
        },
        setCurrentContractEffectiveDate: (state, action) => {
            state.value.currentContract = {
                ...state.value.currentContract,
                effectiveDate: action.payload,
            };
        },
        setCurrentContractTerminationDate: (state, action) => {
            state.value.currentContract = {
                ...state.value.currentContract,
                terminationDate: action.payload,
            };
        },
        setCurrentContractStatus: (state, action) => {
            state.value.currentContract = {
                ...state.value.currentContract,
                status: action.payload,
            };
        },

        setContractsFromEmpty: (state, action) => {
            state.value = {
                ...state.value,
                contracts: action.payload,
            };
        },
        setContractsFilter: (state, action) => {
            state.value = {
                ...state.value,
                contractsFilter: action.payload,
            };
        },
        setContractsFilterMode: (state, action) => {
            state.value = {
                ...state.value,
                contractsFilter: {
                    ...state.value.contractsFilter,
                    mode: action.payload,
                },
            };
        },
        setContractsFilterValue: (state, action) => {
            state.value = {
                ...state.value,
                contractsFilter: {
                    ...state.value.contractsFilter,
                    value: action.payload,
                },
            };
        },
        setContractsFilterData: (state, action) => {
            state.value = {
                ...state.value,
                contractsFilter: {
                    ...state.value.contractsFilter,
                    data: action.payload,
                },
            };
        },
    },
});

export const {
    updateEnterprise,
    setContracts,
    setTabFilter,
    setContractsFromEmpty,
    setCurrentContract,
    resetCurrentContract,
    setCurrentContractName,
    setCurrentContractCreateDate,
    setCurrentContractEffectiveDate,
    setCurrentContractTerminationDate,
    setCurrentContractStatus,
    setContractsFilter,
    setContractsFilterMode,
    setContractsFilterValue,
    setContractsFilterData,
} = contractsSlice.actions;
export default contractsSlice.reducer;
