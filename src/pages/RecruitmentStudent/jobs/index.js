import classNames from 'classnames/bind';
import style from './style.module.scss';

import {
    Box,
    Button,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
    ListItemAvatar,
    Avatar,
} from '@mui/material';

// import  from '@mui/icons-material/ExpandMore';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
// import {
//     UserCheck,
//     Dollar,
//     Address,
//     TimeSVG,
//     Gender,
// } from '../../../access/img/svg/index';

import {
    Link as LinkSelect,
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
    animateScroll,
} from 'react-scroll';

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { jobsByStudentApi } from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';
import JobItem from '../../../components/Student/JobItem';

function Jobs() {
    const cx = classNames.bind(style);
    const requestAuth = useRequestAuth();

    const [suitableJobs, setSuitableJobs] = useState([]);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [inappropriateJobs, setInappropriateJobs] = useState([]);
    const [jobs, setjobs] = useState([]);
    const [suitableJobY, setSuitableJobY] = useState(0);
    const [relatedJobY, setRelatedJobY] = useState(0);
    const [inappropriateJobY, setInappropriateJobY] = useState(0);

    const suitableJobRef = useRef();
    const relatedJobRef = useRef();
    const inappropriateJobRef = useRef();

    // const jobs = [
    //     {
    //         jobID: 'J001',
    //         nameJob: 'Kỹ sư phần mềm',
    //         salary: 7000000,
    //         gender: 'Nam',
    //         workAddress: 'Quận 1',
    //         dateExpired: new Date(2023, 12, 12),
    //         viewed: 78,
    //     },
    //     {
    //         jobID: 'J002',
    //         nameJob: 'Chuyên viên phân tích dữ liệu',
    //         salary: 8000000,
    //         gender: 'Nữ',
    //         workAddress: 'Quận 2',
    //         dateExpired: new Date(2024, 1, 23),
    //         viewed: 16,
    //     },
    //     {
    //         jobID: 'J003',
    //         nameJob: 'Quản lý dự án IT',
    //         salary: 9000000,
    //         gender: 'Nam',
    //         workAddress: 'Quận 3',
    //         dateExpired: new Date(2023, 2, 4),
    //         viewed: 54,
    //     },
    //     {
    //         jobID: 'J004',
    //         nameJob: 'Chuyên viên bảo mật hệ thống',
    //         salary: 8500000,
    //         gender: 'Nữ',
    //         workAddress: 'Quận 4',
    //         dateExpired: new Date(2023, 12, 12),
    //         viewed: 23,
    //     },
    //     {
    //         jobID: 'J005',
    //         nameJob: 'Chuyên viên hỗ trợ kỹ thuật',
    //         salary: 7500000,
    //         gender: 'Nam',
    //         workAddress: 'Quận 5',
    //         dateExpired: new Date(2023, 1, 3),
    //         viewed: 56,
    //     },
    // ];

    const NotFoundJobs = ({ text }) => {
        console.log(text);
        return <div>{text}</div>;
    };

    const FilterJob = ({ ...props }) => {
        const optionsWard = [
            'Quận 1',
            'Quận 2',
            'Quận Thủ Đức',
            'Quận Tân Bình',
            'Quận Bình Thạnh',
        ];

        const optionsCourse = [
            'Khóa học C++',
            'Lập trình Java',
            'Kỹ năng lập trình Python',
            'Tìm hiểu AI',
            'Khóa học nâng câo Front-end',
        ];

        const optionsCompany = [
            'TIKI',
            'Viettel',
            'VNG',
            'Thế giới di động',
            'Công ty Hoàng Anh',
        ];

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
                {...props}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 50,
                    }}
                >
                    <FilterItemJob
                        key={1}
                        title="Việc làm theo quận"
                        styleTitle={{
                            color: 'white',
                            backgroundColor: 'green',
                        }}
                        options={optionsWard}
                    />

                    <FilterItemJob
                        key={2}
                        title="Việc làm theo khóa học"
                        styleTitle={{
                            backgroundColor: 'yellow',
                        }}
                        options={optionsCourse}
                    />

                    <FilterItemJob
                        key={3}
                        title="Việc làm theo công ty"
                        styleTitle={{
                            backgroundColor: 'blue',
                        }}
                        options={optionsCompany}
                    />
                </div>
            </div>
        );
    };

    const FilterItemJob = ({ title, styleTitle, options = [], ...props }) => {
        const Row = ({ option }) => {
            const [open, setOpen] = useState(false);
            const [onMore, setOnMore] = useState(false);

            const handleItemClick = () => {
                setOpen(!open);
            };

            const handleOnMoreClick = () => {
                setOnMore(!onMore);
            };

            useEffect(() => {
                setOnMore(true);
            }, [open]);

            return (
                <div>
                    <ListItemButton divider onClick={handleItemClick}>
                        <ListItemIcon>
                            {!open ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowDown />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={option} />
                    </ListItemButton>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List sx={{ m: 2 }} component="div" disablePadding>
                            {/* TODO */}
                            {[].map((job, index) => (
                                <div>
                                    {index < 2 && (
                                        <ListItemButton>
                                            <ListItemText
                                                primary={job.nameJob}
                                            />
                                        </ListItemButton>
                                    )}
                                    {index === 2 && onMore && (
                                        <ListItemButton
                                            onClick={handleOnMoreClick}
                                        >
                                            <ListItemText primary="... Xem thêm" />
                                        </ListItemButton>
                                    )}
                                    {index >= 2 && !onMore && (
                                        <ListItemButton>
                                            <ListItemText
                                                primary={job.nameJob}
                                            />
                                        </ListItemButton>
                                    )}
                                </div>
                            ))}
                        </List>
                    </Collapse>
                </div>
            );
        };

        return (
            <div>
                <div
                    style={{
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        fontWeight: 600,
                        ...styleTitle,
                        padding: 10,
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <List
                        style={{
                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                        component="nav"
                        aria-label="mailbox folders"
                    >
                        {options.map((option, index) => (
                            <Row key={index} option={option} />
                        ))}
                    </List>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const getJobsByStudent = async () => {
            try {
                const response = await jobsByStudentApi(requestAuth);
                const status = response.status;
                const data = response.data;
                if (status === 200) {
                    setSuitableJobs(data.suitablePosts);
                    setRelatedJobs(data.relatedPosts);
                    setInappropriateJobs(data.inappropriatePosts);
                } else {
                    console.log('NETWORK_ERROR OR ROLE_ERROR');
                }
            } catch (e) {
                console.log('GET_JOBS_ERROR');
            }
        };

        getJobsByStudent();
    }, [requestAuth]);

    useEffect(() => {
        console.log(suitableJobY, relatedJobY, inappropriateJobY);
    }, [suitableJobY, relatedJobY, inappropriateJobY]);

    useEffect(() => {
        const heightHeader = 180;
        const heightHeaderSticky = 50;
        const paddingHeaderSticky = 15;
        const suitableJobHeaderPosition = suitableJobRef.current.offsetTop;
        const relatedJobHeaderPosition = relatedJobRef.current.offsetTop;
        const inappropriateJobHeaderPosition =
            inappropriateJobRef.current.offsetTop;
        setSuitableJobY(
            suitableJobHeaderPosition -
                heightHeader -
                heightHeaderSticky -
                paddingHeaderSticky,
        );
        setRelatedJobY(
            relatedJobHeaderPosition -
                heightHeader -
                heightHeaderSticky -
                paddingHeaderSticky,
        );
        setInappropriateJobY(
            inappropriateJobHeaderPosition -
                heightHeader -
                heightHeaderSticky -
                paddingHeaderSticky,
        );

        let combinedList = [
            ...suitableJobs,
            ...relatedJobs,
            ...inappropriateJobs,
        ];

        let map = new Map(combinedList.map((obj) => [obj.postApplyId, obj]));
        let uniqueList = Array.from(map.values());

        setjobs(uniqueList);
    }, [suitableJobs, relatedJobs, inappropriateJobs]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('main')}>
                <div className={cx('list')}>
                    {/* suitableJobs */}
                    <div className={cx('jobs')}>
                        <div
                            className={cx('header')}
                            onClick={() => {
                                const options = {
                                    duration: 500,
                                    smooth: true,
                                };

                                animateScroll.scrollTo(
                                    suitableJobY - 15,
                                    options,
                                );
                            }}
                        >
                            Công việc phù hợp
                        </div>
                        <div
                            ref={suitableJobRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20,
                            }}
                        >
                            {suitableJobs.length > 0 ? (
                                suitableJobs.map((job) => (
                                    <div className={cx('job-item-wapper')}>
                                        <JobItem
                                            key={job.postApplyId}
                                            job={job}
                                            jobs={jobs}
                                        />
                                    </div>
                                ))
                            ) : (
                                <NotFoundJobs text="Không tìm thấy công việc phù hợp. Hãy tiếp tục theo dõi các công việc này nhé!" />
                            )}
                        </div>
                    </div>

                    {/* relatedJobs */}
                    <div className={cx('jobs')}>
                        <div
                            className={cx('header')}
                            onClick={() => {
                                const options = {
                                    duration: 500,
                                    smooth: true,
                                };

                                animateScroll.scrollTo(relatedJobY, options);
                            }}
                        >
                            Công việc liên quan
                        </div>
                        <div
                            ref={relatedJobRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20,
                            }}
                        >
                            {relatedJobs.length > 0 ? (
                                relatedJobs.map((job) => (
                                    <div className={cx('job-item-wapper')}>
                                        <JobItem
                                            key={job.postApplyId}
                                            job={job}
                                            jobs={jobs}
                                        />
                                    </div>
                                ))
                            ) : (
                                <NotFoundJobs text="Không tìm thấy công việc phù hợp. Hãy quay lại sau khi hoàn thành khóa học nhé!" />
                            )}
                        </div>
                    </div>

                    {/* inappropriateJobs */}
                    <div className={cx('jobs')}>
                        <div
                            className={cx('header')}
                            onClick={() => {
                                const options = {
                                    duration: 500,
                                    smooth: true,
                                };

                                animateScroll.scrollTo(
                                    inappropriateJobY,
                                    options,
                                );
                            }}
                        >
                            Công việc tham khảo
                        </div>
                        <div
                            ref={inappropriateJobRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 20,
                            }}
                        >
                            {inappropriateJobs.length > 0 ? (
                                inappropriateJobs.map((job) => (
                                    <div className={cx('job-item-wapper')}>
                                        <JobItem
                                            key={job.postApplyId}
                                            job={job}
                                            jobs={jobs}
                                        />
                                    </div>
                                ))
                            ) : (
                                <NotFoundJobs text="Không tìm thấy công việc phù hợp. Đăng ký các khóa học để nhận cơ hội làm việc" />
                            )}
                        </div>
                    </div>
                </div>

                <div className={cx('filter')}>
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            backgroundColor: '#f8f99c',
                            borderRadius: 5,
                            padding: 10,
                        }}
                    >
                        Lựa chọn tốt hơn
                    </div>

                    <FilterJob />
                </div>
            </div>
        </div>
    );
}

export default Jobs;
