import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuthEnterprise = () => {
    const location = useLocation();

    const auth = useSelector((state) => state.auth.value);

    return auth?.username ? (
        <Outlet />
    ) : (
        <Navigate
            to={auth?.role === 'MANAGER' ? '/' : '/'}
            state={{ from: location }}
            replace
        />
    );
};

export default RequireAuthEnterprise;
