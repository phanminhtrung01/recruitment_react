import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
    value: {
        post: {},
        test: {
            name: '',
            time: dayjs('00:00').format('HH:mm:ss'),
            testDetails: [
                // {
                //     id: '',
                //     question: '',
                //     answer: '',
                //     type: '',
                //     descriptions: '',
                // },
            ],
        },
        tests: [{ t: {}, ts: [] }],
    },
};

const testSlice = createSlice({
    name: 'test',
    initialState: initialState,
    reducers: {
        updatePost: (state, action) => {
            state.value.post = action.payload;
        },
        updateTest: (state, action) => {
            state.value.test = action.payload;
        },
        updateName: (state, action) => {
            state.value.test.name = action.payload;
        },
        updateTime: (state, action) => {
            state.value.test.time = action.payload;
        },
        updateTestDetails: (state, action) => {
            state.value.test.testDetails = action.payload;
        },
        updateTests: (state, action) => {
            state.value.tests = action.payload;
        },
        updateTestsDetailsT: (state, action) => {
            const tests = state.value.tests;
            const newTests = [];
            const testsP = action.payload;

            testsP.forEach((testP) => {
                const index = tests.findIndex((test) => test.t.id === testP.id);

                if (index === -1) {
                    newTests.push({
                        t: testP,
                        ts: [],
                    });
                } else {
                    const ts = tests[index].ts;
                    newTests.push({
                        t: testP,
                        ts: ts,
                    });
                }
            });

            state.value.tests = newTests;
        },
        updateTestsDetailsTS: (state, action) => {
            const { id, testDetails } = action.payload;

            const index = state.value.tests.findIndex((test) => {
                console.log(test);
                return test.t.id === id;
            });
            console.log(index);
            if (index !== -1) {
                const ts = state.value.tests[index].ts;
                const tsIndex = ts.findIndex((ti) => ti.id === testDetails.id);
                console.log(testDetails);

                if (tsIndex !== -1) {
                    state.value.tests[index].ts[tsIndex] = testDetails;
                } else {
                    state.value.tests[index].ts = [...ts, testDetails];
                }
            }
        },
        setTestsDetailsTS: (state, action) => {
            const { id, testDetails } = action.payload;

            const index = state.value.tests.findIndex((test) => {
                console.log(test);
                return test.t.id === id;
            });
            console.log(index);
            if (index !== -1) {
                state.value.tests[index].ts = testDetails;
            }
        },
        resetRegisterTest: (state) => {
            state.value = initialState.value;
        },
    },
});

export const {
    updatePost,
    updateTest,
    updateName,
    updateTime,
    updateTestDetails,
    updateTests,
    updateTestsDetailsT,
    setTestsDetailsTS,
    updateTestsDetailsTS,
    resetRegisterTest,
} = testSlice.actions;

export default testSlice.reducer;
