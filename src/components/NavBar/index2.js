import Tippy from '@tippyjs/react/headless';
import OneOption from '../TextButtonSingle';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { roleE } from '../../redux/authSlice';

function NavBarHome() {
    const dispatch = useDispatch();

    return (
        <div
            className="navbar-home"
            style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                justifyContent: 'space-between',
                // position: 'fixed',
                // top: 80,
                // left: 0,
                // right: 0,
                // zIndex: 999,
            }}
        >
            <div
                className="auth"
                style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                    }}
                    className="login-home"
                >
                    Đăng nhập
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: -10,
                            borderLeft: '2px solid black',
                        }}
                    />
                </div>
                <div
                    className="register-home"
                    style={{
                        marginLeft: '20px',
                    }}
                >
                    Đăng ký
                </div>
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
                                        dispatch(roleE('MANAGER'));
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
                                        dispatch(roleE('STUDENT'));
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
                                        dispatch(roleE('ENTERPRISE'));
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
