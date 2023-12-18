import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import createFilter from 'redux-persist-transform-filter';
import authReducer from './authSlice';
import contractReducer from './contractSlice';
import contractsReducer from './contractsSlice';
import infoUserSlice from './infoUserSlice';
import postApplySlice from './postApplySlice';
import postsSlice from './postsSlice';
import jobsSlice from './jobsSlice';
import jobSlice from './jobSlice';
import testSlice from './testSlice';

const saveAuthOnlyFilter = createFilter('auth', ['username', 'role']);

const persistConfig = {
    key: 'user',
    storage,
    whitelist: ['auth', 'infoUser', 'job'],
    transform: [saveAuthOnlyFilter],
};

const rootReducer = combineReducers({
    auth: authReducer,
    contract: contractReducer,
    contracts: contractsReducer,
    infoUser: infoUserSlice,
    postApply: postApplySlice,
    posts: postsSlice,
    jobs: jobsSlice,
    job: jobSlice,
    registerTest: testSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: true,
});

export const persister = persistStore(store);
