import { Routes, Route, Outlet } from 'react-router-dom';
import classNames from 'classnames/bind';

import Home from './pages/Home';
import styles from './App.module.scss';
import Recruitment from './pages/Recruitment/index';
import RecruitmentEnterprise from './pages/RecruitmentEnterprise/index';
import Header from './components/Header';
import LoginWrapper from './pages/Auth/login/wrapper';
import LoginEnterprise from './pages/Auth/login/enterprise/login_page';
import Register from './pages/Auth/register/register';
import Registration from './pages/RecruitmentEnterprise/register_recruitment/RegisterRecruitment';
import EnterpriseLayout from './pages/RecruitmentEnterprise/wrapper/layout';
import Contract from './pages/RecruitmentEnterprise/contract';
import Test from './pages/RecruitmentEnterprise/test';
import Post from './pages/RecruitmentEnterprise/post';
import Posts from './pages/RecruitmentEnterprise/posts';
import TraningCenterLayout from './pages/RecruitmentTrainingCenter/wrapper/layout';
import BodyHome from './pages/Home/body/body';
import ContractManager from './pages/RecruitmentTrainingCenter/contract';
import Candidate from './pages/RecruitmentTrainingCenter/candidate';
import PostManager from './pages/RecruitmentTrainingCenter/post';
import Notifier from './pages/RecruitmentTrainingCenter/notifier';
import StudentLayout from './pages/RecruitmentStudent/wrapper/layout';
import Jobs from './pages/RecruitmentStudent/jobs';
import Job from './pages/RecruitmentStudent/job';
import Recored from './pages/RecruitmentStudent/record';

import RequireAuth from './components/RequireAuth';
import RequireAuthEnterprise from './components/RequireAuthEnterprise';
import RequireAuthEnterpriseStudent from './components/RequireAuthEnterpriseStudent';

function App() {
    const cx = classNames.bind(styles);

    return (
        <div className={cx('app')}>
            <Header />
            <Routes>
                {/* Public routes */}
                <Route path="" element={<Home />}>
                    <Route index path="" element={<BodyHome />} />
                </Route>
                <Route path="auth" element={<LoginWrapper />}>
                    <Route
                        path="login/enterprise"
                        element={<LoginEnterprise roleName="ENTERPRISE" />}
                    />

                    <Route
                        path="login/student"
                        element={<LoginEnterprise roleName="STUDENT" />}
                    />
                </Route>
                <Route path="register" element={<Register />} />

                {/* Private routes */}
                <Route path="recruitment" element={<Recruitment />}>
                    {/* Private Training Center routes */}
                    <Route element={<RequireAuth />}>
                        <Route path="" element={<TraningCenterLayout />}>
                            <Route
                                path="contract"
                                element={<ContractManager />}
                            />
                            <Route path="candidate" element={<Candidate />} />
                            <Route path="post" element={<PostManager />} />
                            <Route path="notifier" element={<Notifier />} />
                        </Route>
                    </Route>

                    {/* Private Enterprise routes */}
                    <Route element={<RequireAuthEnterprise />}>
                        <Route path="enterprise" element={<EnterpriseLayout />}>
                            <Route index element={<RecruitmentEnterprise />} />
                            <Route path="register" element={<Registration />} />
                            <Route path="contract" element={<Contract />} />
                            <Route path="test" element={<Test />} />
                            <Route path="post" element={<Post />} />
                            <Route path="posts" element={<Posts />} />
                        </Route>
                    </Route>

                    {/* Private Student routes */}
                    <Route path="student" element={<StudentLayout />}>
                        <Route path="jobs" element={<Jobs />} />
                        <Route element={<RequireAuthEnterpriseStudent />}>
                            <Route path="job" element={<Job />} />
                            <Route path="record" element={<Recored />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
            ;
        </div>
    );
}

export default App;
