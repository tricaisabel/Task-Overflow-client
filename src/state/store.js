import {createStore,applyMiddleware} from 'redux';
import reducers from './reducers/combinedReducers';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'persist-key',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)
const store = createStore(persistedReducer,applyMiddleware(thunk))
let persistor = persistStore(store)
export default store;
export {persistor}