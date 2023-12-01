import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuthEnterprise = () => {
    const auth = useSelector((state) => state.auth.value);
    const location = useLocation();

    return auth?.username ? (
        <Outlet />
    ) : (
        <Navigate
            to={auth?.role === 'STUDENT' ? '/auth/login/student' : ''}
            state={{ from: location }}
            replace
        />
    );
};

export default RequireAuthEnterprise;
