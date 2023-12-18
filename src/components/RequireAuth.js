import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuthEnterprise = () => {
    const location = useLocation();

    const auth = useSelector((state) => state.auth.value);
    const { roleDB, roleUI } = auth;
    console.log('Training Center: ' + auth?.roleDB);
    return roleUI === 'ADMIN' && roleDB === 'ADMIN' ? (
        <Outlet />
    ) : (
        <Navigate
            to={'../auth/login/admin'}
            state={{ from: location }}
            replace
        />
    );
};

export default RequireAuthEnterprise;
