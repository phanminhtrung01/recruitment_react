import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useRefreshToken from '../hooks/useRefreshToken';
import { setAccessToken } from '../redux/authSlice';

const RequireAuthEnterprise = () => {
    const { username, role } = useSelector((state) => state.auth.value);

    const location = useLocation();

    console.log('Enterprise', username);

    return username ? (
        <Outlet />
    ) : (
        <Navigate
            to={role === 'ENTERPRISE' ? '/auth/login/enterprise' : ''}
            state={{ from: location }}
            replace
        />
    );
};

export default RequireAuthEnterprise;
