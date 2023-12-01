import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import {
    styled,
    Avatar,
    Button,
    Chip,
    Divider,
    List,
    Typography,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Box,
    LinearProgress,
    Input,
    TextField,
    Modal,
} from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GiAges } from 'react-icons/gi';
import { FaTransgender } from 'react-icons/fa6';
import { AiFillDollarCircle } from 'react-icons/ai';
import { IoTimer } from 'react-icons/io5';
import { IoNavigateCircle } from 'react-icons/io5';
import { LiaAwardSolid } from 'react-icons/lia';
import { FaUsers } from 'react-icons/fa';
import { MdCancelScheduleSend } from 'react-icons/md';
import { BsArrowRepeat } from 'react-icons/bs';
import { PiExam } from 'react-icons/pi';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';

import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';

import './style.scss';
import JobItem from '../../../components/Student/JobItem';
import {
    getApplyByStudentAndPostApi,
    getContractDetailsByPostApplyApi,
    getCourseByPositionApi,
    getStatusPostApi,
    positionsByContractApi,
} from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';
import {
    setContractDetails,
    setCourses,
    setPositions,
    setApply,
} from '../../../redux/jobSlice';
import { Toaster, toast } from 'sonner';
import NotifierSnackbar from '../../../components/Notification/notifier-error';
import AlertDialogModal from '../../../components/Dialog';
import dayjs from 'dayjs';
import { InfoRounded } from '@mui/icons-material';

function Job() {
    const requestAuth = useRequestAuth();
    const dispatch = useDispatch();

    const [checkRequest, setCheckRequest] = useState(false);
    const [noteStatusPost, setNoteStatusPost] = useState();

    const jobRuducer = useSelector((state) => state.job.value);
    const { job, jobAll, contractDetails, courses, positions, apply } =
        jobRuducer;
    const { amount, contract, position } = contractDetails;
    const { enterprise } = contract;
    const { address, email, name, phone } = enterprise;

    const {
        postApplyId,
        nameJob,
        dateExpire,
        submitted,
        gender,
        age,
        workAddress,
        salary,
        description,
        required,
        benefit,
    } = job;

    const [numberSubmit, setNumberSubmit] = useState(submitted);
    const [openApply, setOpenApply] = useState(false);
    const [statusApply, setStatusApply] = useState({
        status: '',
        value: '',
        note: '',
        access: false,
    });
    let regex = /Quận \d+/;
    let match = workAddress.match(regex);
    let district = match ? match[0] : 'Hồ Chí Minh';

    function FileUpload(props) {
        const { open = false, fk } = props;

        const [openConfirmSubmit, setOpenConfirmSubmit] = useState(open);
        const [openConfirm, setOpenConfirm] = useState(false);

        const [uploadProgress, setUploadProgress] = useState(0);
        const introduceRef = useRef();
        const fileRef = useRef();

        const handleFileUpload = () => {
            if (!fileRef.current || !introduceRef.current) {
                console.log(fileRef.current, introduceRef.current);
                setOpenConfirm(true);
            }

            let formData = new FormData();

            // formData.append('file', selectedFile);
            // formData.append('introduce', a);
            formData.append('dateApply', dayjs());
            formData.append('status', 'Đang xử lý');
            formData.append('studentID', fk?.studentId);
            formData.append('postID', fk?.postApplyId);

            // const responsePromise = requestAuth.post(
            //     '/apply/create',
            //     formData,
            //     {
            //         headers: {
            //             'Content-Type': 'multipart/form-data',
            //         },
            //         onUploadProgress: (progressEvent) => {
            //             let percentCompleted = Math.round(
            //                 (progressEvent.loaded * 100) / progressEvent.total,
            //             );
            //             setUploadProgress(percentCompleted);
            //         },
            //     },
            // );

            // const idToats = toast.promise(responsePromise, {
            //     loading: (
            //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
            //             <Box sx={{ width: '100%', mr: 1 }}>
            //                 <LinearProgress variant="determinate" />
            //             </Box>
            //             <Box sx={{ minWidth: 35 }}>
            //                 <Typography
            //                     variant="body2"
            //                     color="text.secondary"
            //                 >{`${uploadProgress}%`}</Typography>
            //             </Box>
            //         </Box>
            //     ),
            //     success: (data) => {
            //         dispatch(setApply(data.data.data));
            //         check(data.data.data);
            //         setNumberSubmit((pre) => pre + 1);

            //         return NotifierSnackbar({
            //             title: 'Thành công ',
            //             sub1: `Ứng tuyển thành công!`,
            //             toast: toast,
            //             idToats: idToats,
            //         });
            //     },
            //     error: (e) => {
            //         console.log(e);

            //         const responseErr = e?.response.data;
            //         const code = e.code;
            //         let message;
            //         if (code === 'ERR_NETWORK') {
            //             message = e.message;
            //         } else if (code === 'ERR_BAD_REQUEST') {
            //             message = responseErr.message;
            //             console.log('Errrr', message);
            //         }

            //         return NotifierSnackbar({
            //             title: 'Thất bại',
            //             sub1: 'Ứng tuyển thất bại!',
            //             sub2: message,
            //             toast: toast,
            //             idToats: idToats,
            //             type: 'error',
            //         });
            //     },
            // });
        };

        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
        };

        const handleConfirmSaveClick = async (value) => {
            setOpenApply(true);

            if (value === 'agree') {
                handleFileUpload();
            }
        };

        const handleConfirmClick = async (value) => {
            setOpenApply(true);
            if (value === 'agree') {
                setOpenConfirm(false);
                setOpenConfirmSubmit(true);
            }
        };

        const RenderTextEdit = (props) => {
            const { onChangeInput } = props;
            const [introduce, setIntroduce] = useState('');

            useEffect(() => {
                onChangeInput(introduce);
            }, [introduce, onChangeInput]);

            return (
                <ReactQuill
                    value={introduce}
                    onChange={setIntroduce}
                    placeholder="Giới thiệu chung"
                />
            );
        };

        const RenderUploadFile = () => {
            const [selectedFile, setSelectedFile] = useState();

            const handleFileChange = (event) => {
                setSelectedFile(event.target.files[0]);
            };

            useEffect(() => {
                fileRef.current = selectedFile;
            }, [selectedFile]);

            return (
                <TextField
                    sx={{ m: 1 }}
                    type="file"
                    label="Tải lên CV"
                    color="secondary"
                    focused
                    // value={selectedFile?.name}
                    onChange={handleFileChange}
                />
            );
        };

        function ChildModal() {
            const [open, setOpen] = useState(false);
            const handleOpen = () => {
                setOpen(true);
            };
            const handleClose = () => {
                setOpen(false);
            };

            return (
                <Fragment>
                    <Button onClick={handleOpen}>Open Child Modal</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{ ...style, width: 200 }}>
                            <h2 id="child-modal-title">
                                Text in a child modal
                            </h2>
                            <p id="child-modal-description">
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit.
                            </p>
                            <Button onClick={handleClose}>
                                Close Child Modal
                            </Button>
                        </Box>
                    </Modal>
                </Fragment>
            );
        }

        function NestedModal() {
            const [open, setOpen] = useState(false);
            const handleOpen = () => {
                setOpen(true);
            };
            const handleClose = () => {
                setOpen(false);
            };

            return (
                <div>
                    <Button onClick={handleOpen}>Open modal</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...style, width: 400 }}>
                            <div>
                                <RenderUploadFile />
                                <RenderTextEdit
                                    onChangeInput={(value) => {
                                        introduceRef.current = value;
                                    }}
                                />
                            </div>
                            <ChildModal />
                        </Box>
                    </Modal>
                </div>
            );
        }

        return (
            <div>
                <NestedModal />
            </div>
        );

        // return (
        //     <div>

        //         <AlertDialogModal
        //             status="success"
        //             messageSuccess="Ứng tuyển"
        //             maxWidth="sm"
        //             icon={
        //                 <InfoRounded
        //                     sx={{
        //                         fontSize: 20,
        //                     }}
        //                 />
        //             }
        //             headerTitle="Cập nhật thông tin"
        //             content={
        //                 <div>
        //                     <Box
        //                         sx={{
        //                             m: 1,
        //                         }}
        //                     >
        //                         <RenderUploadFile />
        //                         <RenderTextEdit
        //                             onChangeInput={(value) => {
        //                                 introduceRef.current = value;
        //                             }}
        //                         />
        //                     </Box>
        //                 </div>
        //             }
        //             openDialog={[openConfirmSubmit, setOpenConfirmSubmit]}
        //             onButtonClick={(value) => handleConfirmSaveClick(value)}
        //         />
        //         <AlertDialogModal
        //             oneButton={true}
        //             status="success"
        //             messageSuccess="Ứng tuyển"
        //             maxWidth="sm"
        //             icon={
        //                 <InfoRounded
        //                     sx={{
        //                         fontSize: 20,
        //                     }}
        //                 />
        //             }
        //             headerTitle="Cập nhật thông tin"
        //             content="Cần ít nhất 1 thông tin"
        //             openDialog={[openConfirm, setOpenConfirm]}
        //             onButtonClick={(value) => handleConfirmClick(value)}
        //         />
        //     </div>
        // );
    }

    const ListItemTextStyle = styled(ListItemText)(({ theme }) => ({
        '& .MuiTypography-body1': {
            fontSize: '1.3rem',
        },
        '& .MuiTypography-body2': {
            fontSize: '1.2rem',
        },
    }));
    const AvatarStyle = styled(Avatar)(({ theme }) => ({
        backgroundColor: 'rgb(100, 184, 106)',
    }));

    const NotFoundJobs = ({ text }) => {
        console.log(text);
        return <div>{text}</div>;
    };

    useEffect(() => {
        const getStatusPostApply = async () => {
            try {
                const response = await getStatusPostApi(
                    requestAuth,
                    job.postApplyId,
                );

                const status = response?.status;
                const data = response?.data;

                if (status === 200) {
                    setNoteStatusPost(data);
                    console.log(data);
                }
                setCheckRequest(true);
            } catch (e) {
                setCheckRequest(true);
                console.log('STATUS_POST_ERROR');
            }
        };

        const getContractDetailsByPostApply = async (postApplyId) => {
            try {
                const response = await getContractDetailsByPostApplyApi(
                    requestAuth,
                    postApplyId,
                );

                const status = response?.status;
                const data = response?.data;

                if (status === 200) {
                    const newContractDetails = {
                        ...data,
                        jobId: job.postApplyId,
                    };
                    dispatch(setContractDetails(newContractDetails));
                }
            } catch (e) {
                console.log('CONTRACT_DETAIL_ERROR');
            }
        };

        getStatusPostApply();

        if (contractDetails.jobId !== job.postApplyId) {
            getContractDetailsByPostApply(postApplyId);
            console.log('CONTRACT_DETAIL');
        }
    }, [
        contractDetails.jobId,
        dispatch,
        job.postApplyId,
        postApplyId,
        requestAuth,
    ]);

    useEffect(() => {
        const getPositionsByContract = async (contractId) => {
            try {
                const response = await positionsByContractApi(
                    requestAuth,
                    contractId,
                );

                const status = response?.status;
                const data = response?.data;

                if (status === 200) {
                    dispatch(setPositions(data));
                }
            } catch (e) {
                console.log('CONTRACT_DETAIL_ERROR');
            }
        };

        if (contract) {
            const idContract = contract.contractId;

            getPositionsByContract(idContract);
        }
    }, [contract, dispatch, requestAuth]);

    useEffect(() => {
        const getCourseWithPosition = async (positionId) => {
            try {
                const response = await getCourseByPositionApi(
                    requestAuth,
                    positionId,
                );

                const status = response?.status;
                const data = response?.data;

                if (status === 200) {
                    dispatch(setCourses(data));
                }
            } catch (e) {
                console.log('COURSE_ERROR');
            }
        };

        if (position) {
            getCourseWithPosition(position.positionId);
        }
    }, [dispatch, position, requestAuth]);

    useEffect(() => {
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
                setCheckRequest(true);
            } catch (e) {
                setCheckRequest(true);
                console.log('APPLY_ERROR');
            }
        };

        if (!apply || apply?.post?.postApplyId !== job?.postApplyId) {
            if (!checkRequest) {
                getApplyByPostApply();
            }
        }
        console.log('get apply page job');
    }, [apply, checkRequest, dispatch, job.postApplyId, requestAuth]);

    useEffect(() => {
        check(apply);
    }, []);

    const check = useCallback(
        (apply) => {
            let note;
            if (noteStatusPost === 'Đang chờ duyệt') {
                note = 'Bài đăng đang được duyệt, quay lại sau nhé!';
            }
            if (noteStatusPost === 'Từ chối') {
                note = 'Bài đăng đang không hoạt động, tìm công việc khác nhé!';
            }

            console.log(apply);

            if (!apply) {
                setStatusApply({
                    status: 'init',
                    value: 'Ứng tuyển',
                    note: note,
                    access: note ? false : true,
                    icon: <IoNavigateCircle />,
                });
            }

            if (apply?.status === 'Đang xử lý') {
                setStatusApply({
                    status: 'apply',
                    value: 'Hủy ứng tuyển',
                    note: note,
                    access: note ? false : true,
                    icon: <MdCancelScheduleSend />,
                });
            }
            if (apply?.status === 'Từ chối') {
                setStatusApply({
                    status: 'denied',
                    value: 'Ứng tuyển lại',
                    note: note,
                    access: note ? false : true,
                    icon: <BsArrowRepeat />,
                });
            }
            if (apply?.status === 'Đã chấp nhận') {
                setStatusApply({
                    status: 'agree',
                    value: 'Thi',
                    note: note,
                    access: note ? false : true,
                    icon: <PiExam />,
                });
            }

            if (apply?.status === 'Đang kiểm tra') {
                setStatusApply({
                    status: 'test',
                    value: 'Chờ kết quả thi',
                    note: note,
                    access: note ? false : true,
                    icon: <IoReloadCircleOutline />,
                });
            }
            if (apply?.status === 'Đang phỏng vấn') {
                setStatusApply({
                    status: 'interview',
                    value: 'Chờ phỏng vấn',
                    note: note,
                    access: note ? false : true,
                    icon: <MdOutlinePersonSearch />,
                });
            }
            if (apply?.status === 'Đã nhận việc') {
                setStatusApply({
                    status: 'job',
                    value: 'Từ chối công việc',
                    note: note,
                    access: note ? false : true,
                    icon: <ImCancelCircle />,
                });
            }
        },
        [checkRequest, noteStatusPost],
    );

    useEffect(() => {
        console.log('get status apply page job', statusApply);
    }, [statusApply]);

    return (
        <div
            style={{
                paddingLeft: 80,
                paddingRight: 80,
            }}
        >
            <Toaster duration={3000} position="top-right" richColors />

            <div
                className="introduced-job"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    rowGap: 30,
                    columnGap: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 20,
                    marginBottom: 30,
                    borderRadius: 8,
                    backgroundColor: '#f5f6e5',
                    boxShadow:
                        'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            objectFit: 'cover',
                            minHeight: 150,
                            minWidth: 150,
                            borderRadius: '5%',
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
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div
                        className="contains-job"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            className="info-job"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                            }}
                        >
                            <div
                                className="name-job"
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                }}
                            >
                                {nameJob}
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 5,
                                }}
                            >
                                <div
                                    className="address"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 15,
                                        gap: 8,
                                    }}
                                >
                                    <FaMapMarkerAlt size={16} />
                                    {district}
                                </div>
                                <div
                                    className="salary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 15,
                                        gap: 8,
                                    }}
                                >
                                    <AiFillDollarCircle size={16} />
                                    {salary}
                                </div>

                                <div
                                    className="dealine"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 15,
                                        gap: 8,
                                    }}
                                >
                                    <IoTimer size={16} />
                                    {dateExpire}
                                </div>
                            </div>
                        </div>

                        <div
                            className="courses"
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 10,
                            }}
                        >
                            <Chip
                                label={position.name}
                                color="primary"
                                variant="outlined"
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 8,
                            width: 200,
                        }}
                    >
                        <Button
                            disabled={!statusApply.access}
                            style={{
                                fontSize: '100%',
                            }}
                            color={
                                statusApply.status === 'init'
                                    ? 'success'
                                    : 'info'
                            }
                            variant="contained"
                            startIcon={statusApply.icon}
                            onClick={() => {
                                if (statusApply.status === 'init') {
                                    setOpenApply(true);
                                }

                                let responsePromise;
                                if (statusApply.status === 'apply') {
                                    responsePromise = requestAuth.delete(
                                        '/apply/delete',
                                        {
                                            params: {
                                                jobApplyId: apply?.jobApplyId,
                                            },
                                        },
                                    );
                                } else if (statusApply.status === 'denied') {
                                    const statusApplyRequest = 'Đang xử lý';
                                    const newApply = {
                                        ...apply,
                                        status: statusApplyRequest,
                                    };

                                    responsePromise = requestAuth.put(
                                        '/apply/update',
                                        JSON.stringify(newApply),
                                    );
                                } else if (statusApply.status === 'agree') {
                                    responsePromise = requestAuth.delete(
                                        '/apply/delete',
                                        {
                                            params: {
                                                jobApplyId: apply?.jobApplyId,
                                            },
                                        },
                                    );
                                } else if (statusApply.status === 'agree') {
                                    //!OPEN FORM TEST EXAM
                                } else if (statusApply.status === 'test') {
                                    //!OPEN DIALOG DETAILS TEST
                                } else if (statusApply.status === 'interview') {
                                    //!OPEN DIALOG DETAILS INTERVIEW
                                }

                                if (responsePromise) {
                                    const idToats = toast.promise(
                                        responsePromise,
                                        {
                                            loading: 'Đang xử lý...',
                                            success: (data) => {
                                                dispatch(
                                                    setApply(data.data.data),
                                                );
                                                check(data.data.data);

                                                return NotifierSnackbar({
                                                    title: 'Thành công ',
                                                    sub1: `${statusApply.value} thành công!`,
                                                    toast: toast,
                                                    idToats: idToats,
                                                });
                                            },
                                            error: (e) => {
                                                const responseErr =
                                                    e?.response.data;
                                                const code = e.code;
                                                let message;
                                                if (code === 'ERR_NETWORK') {
                                                    message = e.message;
                                                } else if (
                                                    code === 'ERR_BAD_REQUEST'
                                                ) {
                                                    message =
                                                        responseErr.message;
                                                    console.log(
                                                        'Errrr',
                                                        message,
                                                    );
                                                }

                                                return NotifierSnackbar({
                                                    title: 'Thất bại',
                                                    sub1: `${statusApply.value} thất bại!`,
                                                    sub2: message,
                                                    toast: toast,
                                                    idToats: idToats,
                                                    type: 'error',
                                                });
                                            },
                                        },
                                    );
                                }
                            }}
                        >
                            {statusApply.value}
                        </Button>
                        <FileUpload
                            open={openApply}
                            fk={{
                                studentId: 'ST90IJ12KL',
                                postApplyId: job.postApplyId,
                            }}
                        />
                        <div
                            style={{
                                fontSize: '14px',
                                color: 'yellowgreen',
                            }}
                        >
                            {statusApply.note}
                        </div>
                        <div
                            style={{
                                fontSize: '13px',
                            }}
                        >
                            Lượt ứng tuyển: {numberSubmit}
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    rowGap: 30,
                    columnGap: 30,
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 25,
                        flex: 4,
                    }}
                >
                    <div
                        className="details-job"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 25,
                            padding: '10px',
                            borderRadius: 8,
                            backgroundColor: '#f5f6e5',
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                        }}
                    >
                        <div className="description-job">
                            <div
                                style={{
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Mô tả công việc
                            </div>
                            <div
                                style={{
                                    fontSize: '1.4rem',
                                    padding: 10,
                                }}
                            >
                                <ReactQuill
                                    className="view-text"
                                    readOnly
                                    value={description}
                                />
                            </div>
                        </div>

                        <div className="required-job">
                            <div
                                style={{
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Yêu cầu công việc
                            </div>
                            <div
                                style={{
                                    fontSize: '1.4rem',
                                    padding: 10,
                                }}
                            >
                                <ReactQuill
                                    className="view-text"
                                    readOnly
                                    value={required}
                                />
                            </div>
                        </div>

                        <div className="benefit-job">
                            <div
                                style={{
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Quyền lợi
                            </div>
                            <div
                                style={{
                                    fontSize: '1.4rem',
                                    padding: 10,
                                }}
                            >
                                <ReactQuill
                                    className="view-text"
                                    readOnly
                                    value={benefit}
                                />
                            </div>
                        </div>

                        <div className="address-job">
                            <div
                                style={{
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Địa điểm làm việc
                            </div>
                            <div
                                style={{
                                    fontSize: '1.4rem',
                                    padding: 10,
                                }}
                            >
                                <Chip
                                    sx={{
                                        borderRadius: 1,
                                    }}
                                    label={workAddress}
                                    variant="outlined"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className="details-job"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 25,
                            padding: '10px',
                            borderRadius: 8,
                            backgroundColor: '#f5f6e5',
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: '1.6rem',
                                    fontWeight: '600',
                                }}
                            >
                                Việc làm tương tự
                            </div>
                            <div
                                style={{
                                    fontSize: '1.4rem',
                                    padding: 10,
                                }}
                            >
                                {jobAll.length > 0 ? (
                                    jobAll.map((job, index) => (
                                        <div
                                            className={'job-item-wapper'}
                                            key={job ? job.postApplyId : index}
                                        >
                                            <JobItem job={job} jobs={jobAll} />
                                        </div>
                                    ))
                                ) : (
                                    <NotFoundJobs text="Không tìm thấy công việc phù hợp. Hãy tiếp tục theo dõi các công việc này nhé!" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="info-job"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '200px',
                        flex: 2,
                        gap: 25,
                    }}
                >
                    <div
                        className="info-enterprise"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            padding: 10,
                            gap: 10,
                            borderRadius: 8,
                            backgroundColor: '#f5f6e5',
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                            }}
                        >
                            Thông tin công ty
                        </div>
                        <div
                            className="details-enterprise"
                            style={{
                                display: 'flex',
                                width: '100%',
                                padding: 10,
                                gap: 20,
                                borderRadius: 8,
                            }}
                        >
                            <div
                                style={{
                                    maxHeight: 80,
                                    maxWidth: 80,
                                    minWidth: 50,
                                    minHeight: 50,
                                    objectFit: 'fill',
                                    borderRadius: 8,
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

                            <div>
                                <div
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {name}
                                </div>
                                <div
                                    style={{
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    {address}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="info-details-job"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 10,
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: '#f5f6e5',
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                            }}
                        >
                            Thông tin công việc
                        </div>

                        <List
                            sx={{
                                width: '100%',
                                maxWidth: 360,
                                bgcolor: 'transparent',
                            }}
                        >
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <AvatarStyle>
                                        <LiaAwardSolid size={20} />
                                    </AvatarStyle>
                                </ListItemAvatar>
                                <ListItemTextStyle
                                    sx={{
                                        fontSize: '1.4rem',
                                    }}
                                    primary="Cấp bậc"
                                    secondary="Nhân viên"
                                />
                            </ListItem>
                            <Divider variant="middle" flexItem />
                            <ListItem>
                                <ListItemAvatar>
                                    <AvatarStyle>
                                        <FaUsers size={20} />
                                    </AvatarStyle>
                                </ListItemAvatar>
                                <ListItemTextStyle
                                    primary="Số lượng tuyển"
                                    secondary={amount}
                                />
                            </ListItem>
                            <Divider variant="middle" flexItem />
                            <ListItem>
                                <ListItemAvatar>
                                    <AvatarStyle>
                                        <FaTransgender size={17} />
                                    </AvatarStyle>
                                </ListItemAvatar>
                                <ListItemTextStyle
                                    primary="Giới tính"
                                    secondary={gender}
                                />
                            </ListItem>
                            <Divider variant="middle" flexItem />
                            <ListItem>
                                <ListItemAvatar>
                                    <AvatarStyle>
                                        <GiAges size={20} />
                                    </AvatarStyle>
                                </ListItemAvatar>
                                <ListItemTextStyle
                                    primary="Tuổi"
                                    secondary={age}
                                />
                            </ListItem>
                        </List>
                    </div>

                    <div
                        className="more-job"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 25,
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: '#f5f6e5',
                            boxShadow:
                                'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                        }}
                    >
                        <div className="positions">
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                }}
                            >
                                Vị trí
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    rowGap: 10,
                                    columnGap: 10,
                                    padding: 10,
                                }}
                            >
                                {positions?.map((pos, i) => (
                                    <>
                                        <div key={pos ? pos.positionId : i}>
                                            <Chip
                                                sx={{
                                                    borderRadius: 1,
                                                }}
                                                label={pos.name}
                                                variant="outlined"
                                            />
                                        </div>
                                        {i < positions.length - 1 && (
                                            <Divider
                                                key={pos ? pos.positionId : i}
                                                orientation="vertical"
                                                variant="fullWidth"
                                                flexItem
                                            />
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>

                        <div className="courses">
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                }}
                            >
                                Khóa học liên quan
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    rowGap: 10,
                                    columnGap: 10,
                                    padding: 10,
                                }}
                            >
                                {courses?.map((course, index) => (
                                    <>
                                        <div
                                            key={
                                                course ? course.courseId : index
                                            }
                                        >
                                            {course.name}
                                        </div>
                                        {index < courses.length - 1 && (
                                            <Divider
                                                key={
                                                    course
                                                        ? course.courseId
                                                        : index
                                                }
                                                orientation="vertical"
                                                variant="fullWidth"
                                                flexItem
                                            />
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>

                        <div className="areal">
                            <div
                                style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                }}
                            >
                                Khu vực
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    rowGap: 10,
                                    columnGap: 10,
                                    padding: 10,
                                }}
                            >
                                <div> Hồ Chí Minh</div>
                                <Divider
                                    orientation="vertical"
                                    variant="fullWidth"
                                    flexItem
                                />
                                <div>{district}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Job;
