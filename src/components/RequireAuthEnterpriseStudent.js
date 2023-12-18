import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuthStudent = () => {
    const location = useLocation();

    const auth = useSelector((state) => state.auth.value);
    const { roleDB, roleUI } = auth;
    console.log('Training Center: ' + auth?.roleDB);
    return roleUI === 'STUDENT' && roleDB === 'STUDENT' ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/login/student" state={{ from: location }} replace />
    );
};

export default RequireAuthStudent;
