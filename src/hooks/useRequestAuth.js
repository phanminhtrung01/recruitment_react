import { requestAuth } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { useSelector, useDispatch } from 'react-redux';
import { calculateHMAC } from '../hooks/useHMAC';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../redux/authSlice';

function useRequestAuth() {
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const { role, accessToken } = useSelector((state) => state.auth.value);
    const dispatch = useDispatch();

    useEffect(() => {
        const requestIntercept = requestAuth.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;

                    let newAccessToken = accessToken;
                    let pathRole;
                    if (!newAccessToken) {
                        newAccessToken = await refresh();
                        dispatch(setAccessToken(newAccessToken));
                    }

                    if (!newAccessToken) {
                        if (role === 'ENTERPRISE') {
                            pathRole = 'enterprise';
                        } else if (role === 'STUDENT') {
                            pathRole = 'student';
                        }
                        navigate(`/auth/login/${pathRole}`, { replace: true });
                    }

                    Cookies.set('data', calculateHMAC(newAccessToken), {
                        path: '/',
                    });

                    Cookies.set('at', newAccessToken, {
                        path: '/',
                    });
                }

                return config;
            },
            (error) => Promise.reject(error),
        );

        const responseIntercet = requestAuth.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;

                const status = error?.response?.status;

                if (error?.response && status === 406 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();

                    prevRequest.headers[
                        'Authorization'
                    ] = `Bearer ${newAccessToken}`;

                    if (newAccessToken) {
                        Cookies.set('at', newAccessToken, {
                            path: '/',
                        });
                        dispatch(setAccessToken(newAccessToken));
                    }

                    return requestAuth(prevRequest);
                }

                return Promise.reject(error);
            },
        );

        return () => {
            requestAuth.interceptors.request.eject(requestIntercept);
            requestAuth.interceptors.response.eject(responseIntercet);
        };
    }, [accessToken]);

    return requestAuth;
}

export default useRequestAuth;
