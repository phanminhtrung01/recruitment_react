import Tippy from '@tippyjs/react/headless';
import OneOption from '../TextButtonSingle';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRoleUI } from '../../redux/authSlice';
import { Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resetAuth } from '../../redux/authSlice';
import { resetInfoUser } from '../../redux/infoUserSlice';

function NavBarHome() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth.value);
    const { username, accessToken, roleDB } = auth;

    return (
        <div
            className="navbar-home"
            style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                justifyContent: 'space-between',
            }}
        >
            <div
                className="auth"
                style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    gap: 5,
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        fontSize: 16,
                    }}
                >
                    Đăng nhập
                </Button>

                {username && accessToken && roleDB === 'ADMIN' && (
                    <div>
                        <Divider
                            orientation="vertical"
                            variant="fullWidth"
                            flexItem
                        />
                        <Button
                            onClick={() => {
                                navigate('/', {
                                    replace: true,
                                });
                                dispatch(resetAuth());
                                dispatch(resetInfoUser());
                            }}
                            variant="outlined"
                            sx={{
                                fontSize: 16,
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </div>
                )}
            </div>
            <div className="action" style={{}}>
                <OneOption text="Giới thiệu" />
                <Tippy
                    render={(attrs) => (
                        <div className="box" tabIndex="-1" {...attrs}>
                            <div
                                className="train-contains"
                                style={{
                                    display: 'grid',
                                    maxHeight: '250px !important',
                                    overflowX: 'hidden',
                                    overflowY: 'auto',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gridGap: '10px',
                                    backgroundColor: 'rgb(255, 228, 138)',
                                    margin: '10px',
                                    padding: '10px',
                                    borderRadius: '20px',
                                }}
                            >
                                <OneOption
                                    text="ReactJS"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                                <OneOption
                                    text="Java"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                                <OneOption
                                    text="NodeJS"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                                <OneOption
                                    text="HTML"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                                <OneOption
                                    text="Python"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                                <OneOption
                                    text="C#"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                                <OneOption
                                    text="C++"
                                    styleText={{ fontSize: '20px' }}
                                    property1="hover selected"
                                />
                            </div>
                        </div>
                    )}
                    placement="bottom"
                    interactive={true}
                >
                    <OneOption text="Đào tạo" />
                </Tippy>
                <OneOption text="Tin tức" />
                <Tippy
                    render={(attrs) => (
                        <div className="box" tabIndex="-1" {...attrs}>
                            <div
                                className="recruitment-contains"
                                style={{
                                    display: 'flex',
                                    maxHeight: '250px !important',
                                    overflowX: 'hidden',
                                    overflowY: 'auto',
                                    flexDirection: 'column',
                                    backgroundColor: 'rgb(255, 228, 138)',
                                    margin: '10px',
                                    padding: '10px',
                                    borderRadius: '20px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Link
                                    to="/recruitment/contract"
                                    onClick={() => {
                                        dispatch(setRoleUI('ADMIN'));
                                    }}
                                >
                                    <OneOption
                                        text="Trung tâm"
                                        styleText={{ fontSize: '16px' }}
                                        styleOption={{ padding: '15px 60px' }}
                                        property1="hover selected"
                                    />
                                </Link>
                                <Link
                                    to="recruitment/student/jobs"
                                    onClick={() => {
                                        dispatch(setRoleUI('STUDENT'));
                                    }}
                                >
                                    <OneOption
                                        text="Sinh viên"
                                        styleText={{ fontSize: '16px' }}
                                        styleOption={{ padding: '15px 60px' }}
                                        property1="hover selected"
                                    />
                                </Link>

                                <Link
                                    to="recruitment/enterprise"
                                    onClick={() => {
                                        dispatch(setRoleUI('ENTERPRISE'));
                                    }}
                                >
                                    <OneOption
                                        text="Doanh nghiệp"
                                        styleText={{ fontSize: '16px' }}
                                        styleOption={{ padding: '15px 60px' }}
                                        property1="hover selected"
                                    />
                                </Link>
                            </div>
                        </div>
                    )}
                    placement="bottom"
                    interactive={true}
                >
                    <OneOption text="Tuyển dụng" />
                </Tippy>
            </div>
        </div>
    );
}

export default NavBarHome;
