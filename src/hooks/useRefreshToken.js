import { post } from '../api/axios';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../redux/authSlice';
import { requestAuth } from '../api/axios';

function useRefreshToken() {
    const dispatch = useDispatch();

    const refresh = async () => {
        const response = await requestAuth.post('/v1/auth/refresh-token');
        

        dispatch(setAccessToken(response.data.data.accessToken));

        return response.data.data.accessToken;
    };

    return refresh;
}

export default useRefreshToken;
