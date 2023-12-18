import { requestAuth } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { useSelector, useDispatch } from 'react-redux';
import { calculateHMAC } from '../hooks/useHMAC';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAccessToken } from '../redux/authSlice';

function useRequestAuth() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const auth = useSelector((state) => state.auth.value);
    const { roleDB, roleUI, accessToken } = auth;

    useEffect(() => {
        const requestIntercept = requestAuth.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;

                    console.log('Bearer: ' + accessToken);
                    let pathRole;
                    if (!accessToken) {
                        if (
                            roleDB === 'ENTERPRISE' ||
                            roleUI === 'ENTERPRISE'
                        ) {
                            pathRole = 'enterprise';
                        } else if (
                            roleDB === 'STUDENT' ||
                            roleUI === 'STUDENT'
                        ) {
                            pathRole = 'student';
                        }
                        if (pathRole) {
                            navigate(`/auth/login/${pathRole}`, {
                                state: { from: location },
                                replace: true,
                            });
                        } else {
                            navigate('/', {
                                replace: true,
                            });
                        }
                    }

                    Cookies.set('data', calculateHMAC(accessToken), {
                        path: '/',
                    });

                    Cookies.set('at', accessToken, {
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
                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
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
