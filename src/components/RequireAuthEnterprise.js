import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const RequireAuthEnterprise = () => {
    const location = useLocation();

    const auth = useSelector((state) => state.auth.value);
    const { roleDB, roleUI } = auth;
    console.log('Training Center: ' + auth?.roleDB);

    return roleUI === 'ENTERPRISE' && roleDB === 'ENTERPRISE' ? (
        <Outlet />
    ) : (
        <Navigate
            to={'/auth/login/enterprise'}
            state={{ from: location }}
            replace
        />
    );
};

export default RequireAuthEnterprise;
