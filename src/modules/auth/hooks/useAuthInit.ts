import { useEffect, useRef } from "react";
import { getToken, setToken } from "../../../api";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchCurrentUser, clearError, setLoading } from "../reducers/authReducer";

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, token } = useAppSelector((state) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialise = async () => {
      const storedToken = getToken();

      if (token && !storedToken) {
        setToken(token);
      }

      if (storedToken ?? token) {
        dispatch(fetchCurrentUser());
      } else {
        dispatch(setLoading(false));
        dispatch(clearError());
      }
    };

    void initialise();
  }, [dispatch, token]);

  return { isAuthenticated, user, isLoading };
};
