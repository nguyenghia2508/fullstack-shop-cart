import { configureStore } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from "redux";
import userReducer from './features/userSlice'
import userCartReducer from './features/useCartSlice'
import actionProductReducer from "./features/actionProductSlice";
import checkoutReducer from "./features/checkoutSlide";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  userCart: userCartReducer,
  actionProduct:actionProductReducer,
  checkout:checkoutReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);