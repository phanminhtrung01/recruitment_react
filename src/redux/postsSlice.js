import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const today = dayjs();

const initialState = {
    value: {
        posts: [],
        currentPost: {
            postApplyId: '',
            nameJob: '',
            datePost: today.format(DEFAULT_DATE_FORMAT),
            dateExpire: today.add(1, 'day').format(DEFAULT_DATE_FORMAT),
            status: 'Đang chờ duyệt',
        },
        tabFilter: 'wait-approve',
        postsFilter: {
            mode: '',
            value: '',
            data: [],
        },
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState: initialState,
    reducers: {
        setPosts: (state, action) => {
            state.value = {
                ...state.value,
                posts: [action.payload, ...state.value.posts],
            };
        },
        setTabFilter: (state, action) => {
            state.value = {
                ...state.value,
                tabFilter: action.payload,
            };
        },
        setCurrentPost: (state, action) => {
            state.value = {
                ...state.value,
                currentPost: action.payload,
            };
        },
        resetCurrentPost: (state) => {
            state.value.currentPost = initialState.value.currentPost;
        },
        setCurrentPostNameJob: (state, action) => {
            state.value.currentPost = {
                ...state.value.currentPost,
                nameJob: action.payload,
            };
        },
        setCurrentPostDatePost: (state, action) => {
            state.value.currentPost = {
                ...state.value.currentPost,
                datePost: action.payload,
            };
        },
        setCurrentPostDateExpire: (state, action) => {
            state.value.currentPost = {
                ...state.value.currentPost,
                dateExpire: action.payload,
            };
        },
        setPostsFromEmpty: (state, action) => {
            state.value = {
                ...state.value,
                posts: action.payload,
            };
        },
        setPostsFilter: (state, action) => {
            state.value = {
                ...state.value,
                postsFilter: action.payload,
            };
        },
        setPostsFilterMode: (state, action) => {
            state.value = {
                ...state.value,
                postsFilter: {
                    ...state.value.postsFilter,
                    mode: action.payload,
                },
            };
        },
        setPostsFilterValue: (state, action) => {
            state.value = {
                ...state.value,
                postsFilter: {
                    ...state.value.postsFilter,
                    value: action.payload,
                },
            };
        },
        setPostsFilterData: (state, action) => {
            state.value = {
                ...state.value,
                postsFilter: {
                    ...state.value.postsFilter,
                    data: action.payload,
                },
            };
        },
    },
});

export const {
    setPosts,
    setTabFilter,
    setCurrentPost,
    resetCurrentPost,
    setCurrentPostNameJob,
    setCurrentPostDatePost,
    setCurrentPostDateExpire,
    setPostsFromEmpty,
    setPostsFilter,
    setContractsFilterMode,
    setPostsFilterMode,
    setPostsFilterValue,
    setPostsFilterData,
} = postsSlice.actions;
export default postsSlice.reducer;
