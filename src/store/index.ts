import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../modules/auth/reducers/authReducer";
import tripReducer from "../modules/trip/reducers/tripSlice";

// Reset action type
export const RESET_STATE = "RESET_STATE";

// Reset action creator
export const resetState = () => ({
  type: RESET_STATE,
});

// First define the base app reducer
const appReducer = combineReducers({
  auth: authReducer,
  trip: tripReducer,
});

type AppState = ReturnType<typeof appReducer>;

// Root reducer that can handle state reset
const rootReducer = (state: AppState | undefined, action: Action) => {
  // Clear all state when RESET_STATE action is dispatched
  if (action.type === RESET_STATE) {
    // Clear persisted state from storage
    storage.removeItem("persist:root");

    // Return undefined to reset all reducers to their initial state
    return appReducer(undefined, action);
  }

  // Otherwise, proceed with normal state updates
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  // Only persist auth state to avoid storing too much data
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", RESET_STATE],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "meta.promise"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates", "auth.user.lastLoginAt", "auth.user.createdAt", "auth.user.updatedAt"],
      },
    }),
});

const persistor = persistStore(store);

// Export types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof appReducer>;
export type AppStore = typeof store;

// Custom hooks
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Helper function to clear all state
export const clearState = () => {
  store.dispatch(resetState());
  persistor.purge(); // Clear persisted state
};

export { persistor, store };
