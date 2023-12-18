import classNames from 'classnames/bind';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaTransgender } from 'react-icons/fa6';
import { AiFillDollarCircle } from 'react-icons/ai';
import { IoTimer } from 'react-icons/io5';
import { FaUserCheck } from 'react-icons/fa';

import dayjs from 'dayjs';

import { Button } from '@mui/material';

import style from './style.module.scss';
import { Link } from 'react-router-dom';
import {
    setJob,
    setJobAll,
    setContractDetails,
    setApply,
    setClassesPostStudent,
} from '../../redux/jobSlice';
import {
    authInfoApi,
    getApplyByStudentAndPostApi,
    getClassesByPostApplyAndStudentApi,
    getContractDetailsByPostApplyApi,
} from '../../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import useRequestAuth from '../../hooks/useRequestAuth';
import { useEffect, useState } from 'react';
import { updateAll } from '../../redux/infoUserSlice';

const JobItem = ({ job, jobs }) => {
    const cx = classNames.bind(style);
    const dispatch = useDispatch();
    const { contractDetails, apply } = useSelector((state) => state.job.value);
    const requestAuth = useRequestAuth();
    const { nameJob, salary, gender, workAddress, dateExpired, viewed } = job;
    const [mount, setMount] = useState(false);
    const { info } = useSelector((state) => state.infoUser?.value);
    const studentId = info?.studentId;

    useEffect(() => {
        const getInfo = async () => {
            const response = await authInfoApi(requestAuth);

            if (response?.status === 200) {
                dispatch(updateAll(response.data));

                return response.data;
            }
        };

        if (!info && !mount) {
            getInfo();
            setMount(true);
        }
    }, [info, mount]);

    const getContractDetailsByPostApply = async () => {
        try {
            const response = await getContractDetailsByPostApplyApi(
                requestAuth,
                job.postApplyId,
            );

            const status = response?.status;
            const data = response?.data;

            if (status === 200) {
                const newContractDetails = { ...data, jobId: job.postApplyId };
                dispatch(setContractDetails(newContractDetails));
            }
        } catch (e) {
            console.log('CONTRACT_DETAIL_ERROR');
        }
    };

    const getClassByPostApplyAndStudent = async (studentId) => {
        try {
            const response = await getClassesByPostApplyAndStudentApi(
                requestAuth,
                job.postApplyId,
                studentId,
            );

            const status = response?.status;
            const data = response?.data;

            if (status === 200) {
                dispatch(setClassesPostStudent(data));
            }
        } catch (e) {
            console.log('CLASS_POST_STUDENT_ERROR');
        }
    };

    const getApplyByPostApply = async () => {
        try {
            const response = await getApplyByStudentAndPostApi(
                requestAuth,
                job.postApplyId,
            );

            const status = response?.status;
            const data = response?.data;

            if (status === 200) {
                dispatch(setApply(data));
            }
        } catch (e) {
            console.log('APPLY_ERROR');
        }
    };

    return (
        <div
            className={cx('job-item')}
            onMouseEnter={() => {
                if (contractDetails?.jobId !== job.postApplyId) {
                    getContractDetailsByPostApply();
                }

                if (!apply || apply.post?.postApplyId !== job.postApplyId) {
                    getApplyByPostApply();
                    getClassByPostApplyAndStudent();
                }
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    rowGap: 20,
                    columnGap: 10,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flex: 9,
                    }}
                >
                    <div
                        style={{
                            height: 100,
                            width: 100,
                        }}
                    >
                        <div
                            className="image-job"
                            style={{
                                height: 100,
                                width: 100,
                                objectFit: 'cover',
                                borderRadius: '5%',
                                border: '1px solid #e0e0fd',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                height="100%"
                                width="100%"
                                src="https://cdn-new.topcv.vn/unsafe/200x/filters:format(webp)/https://static.topcv.vn/company_logos/vBWMEGncsF00niBOQ9DkEO1kW3Ij5Ut1_1664778366____f7cdac52bd7fa9b167eb833f4729dc29.png"
                                alt="ada"
                            />
                        </div>
                    </div>

                    <div
                        className="info-container-job"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontSize: '15px',
                            gap: 10,
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            className={cx('name-job')}
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                            }}
                        >
                            {nameJob}
                        </div>

                        <ul
                            className="info-job"
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                rowGap: 5,
                                columnGap: 15,
                                flex: 3,
                            }}
                        >
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    minWidth: 550,
                                    flex: 6,
                                }}
                            >
                                <FaMapMarkerAlt />
                                {workAddress}
                            </li>

                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    //minWidth: 250,
                                    flex: 3,
                                }}
                            >
                                <AiFillDollarCircle />
                                {salary}
                            </li>

                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    //minWidth: 50,
                                    flex: 1,
                                }}
                            >
                                <FaUserCheck />
                                {viewed}
                            </li>
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    //minWidth: 100,
                                    flex: 2,
                                }}
                            >
                                <FaTransgender height="18px" width="18px" />
                                {gender}
                            </li>
                            <li
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    //minWidth: 100,
                                    flex: 2,
                                }}
                            >
                                <IoTimer />
                                {dayjs(dateExpired).format('DD/MM/YYYY')}
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className="action-job"
                    style={{
                        width: 100,
                        float: 'right',
                        flex: 1,
                    }}
                >
                    <div
                        style={{
                            width: 100,
                        }}
                    >
                        <Link to="../job">
                            <Button
                                style={{
                                    fontSize: '1.2rem',
                                    height: '100%',
                                }}
                                variant="outlined"
                                onClick={async () => {
                                    dispatch(setJob(job));
                                    const jobsUtilJobCurrent = jobs.filter(
                                        (job1) =>
                                            job1.postApplyId !==
                                            job.postApplyId,
                                    );
                                    dispatch(setJobAll(jobsUtilJobCurrent));
                                    try {
                                        const response = await requestAuth.post(
                                            '/view_post/add_by_post',
                                            {
                                                params: {
                                                    studentId: studentId,
                                                    postId: job.postApplyId,
                                                },
                                            },
                                        );
                                        console.log(response.data);
                                    } catch (error) {
                                        console.log('STUDENT_VIEWPOST_ERROR');
                                    }
                                }}
                            >
                                Chi tiết
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobItem;
