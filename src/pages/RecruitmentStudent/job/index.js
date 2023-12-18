import {
    useState,
    useEffect,
    useCallback,
    useRef,
    Fragment,
    forwardRef,
    useImperativeHandle,
} from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Autocomplete,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardActions,
    Grid,
} from '@mui/material';
import { RiTimerFill } from 'react-icons/ri';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import { FcAcceptDatabase } from 'react-icons/fc';

import * as React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import { useTheme } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import './style.scss';
import JobItem from '../../../components/Student/JobItem';
import {
    authInfoApi,
    getApplyByStudentAndPostApi,
    getClassByPositionApi,
    getClassesByPostApplyAndStudentApi,
    getContractDetailsByPostApplyApi,
    getCourseByPositionApi,
    getStatusPostApi,
    getTestsByPostsApi,
    positionsByContractApi,
} from '../../../api/auth';
import useRequestAuth from '../../../hooks/useRequestAuth';
import {
    setContractDetails,
    setCourses,
    setPositions,
    setApply,
    setClassesPostStudent,
    setClassesPosition,
} from '../../../redux/jobSlice';
import { Toaster, toast } from 'sonner';
import NotifierSnackbar from '../../../components/Notification/notifier-error';
import AlertDialogModal from '../../../components/Dialog';
import dayjs from 'dayjs';

import { TimeField } from '@mui/x-date-pickers';

import AlertDialogModalNested from '../../../components/Dialog';

import { updateAll } from '../../../redux/infoUserSlice';

function Job() {
    const requestAuth = useRequestAuth();
    const dispatch = useDispatch();

    const [checkRequest, setCheckRequest] = useState(false);
    const [noteStatusPost, setNoteStatusPost] = useState();

    const jobReducer = useSelector((state) => state.job.value);

    const {
        job,
        jobAll,
        contractDetails,
        courses,
        positions,
        apply,
        classesPostStudent,
        classesPosition,
    } = jobReducer;

    const { info } = useSelector((state) => state.infoUser?.value);
    const [mount, setMount] = useState(false);
    const studentId = info?.studentId;

    const { contract, position } = contractDetails;
    const { enterprise } = contract;
    const { address, email, name, phone } = enterprise;

    const {
        postApplyId,
        amount,
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
    const [openTest, setOpenTest] = useState(false);
    const [openInterview, setOpenInterview] = useState(false);
    const [anchor, setAnchor] = useState();
    const [statusApply, setStatusApply] = useState({
        status: '',
        value: '',
        note: '',
        access: false,
    });
    let regex = /Quận \d+/;
    let match = workAddress.match(regex);
    let district = match ? match[0] : 'Hồ Chí Minh';

    const RenderTime = forwardRef((props, ref) => {
        const [seconds, setSeconds] = useState(0);
        const [timeString, setTimeString] = useState();
        const [isActive, setIsActive] = useState(false);

        function toggle() {
            setIsActive(!isActive);
        }

        function reset() {
            setSeconds(0);
            setIsActive(false);
        }

        useImperativeHandle(ref, () => ({
            toggle() {
                toggle();
            },
            reset() {
                reset();
            },
        }));

        useEffect(() => {
            let interval = null;
            if (isActive) {
                interval = setInterval(() => {
                    setSeconds((seconds) => seconds + 1);
                }, 1000);
            } else if (!isActive && seconds !== 0) {
                clearInterval(interval);
            }
            return () => clearInterval(interval);
        }, [isActive, seconds]);

        useEffect(() => {
            const timeString = new Date(seconds * 1000)
                .toISOString()
                .substr(11, 8);
            setTimeString(timeString);
        }, [seconds]);

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <RiTimerFill size={18} />
                {timeString}
            </div>
        );
    });

    const RenderTest = (props) => {
        const { post, openConfirm } = props;
        const [viewCell, setViewCell] = useState(openConfirm ? false : true);
        const [openTestDetails, setOpenTestDetails] = useState(false);
        const [openExams, setOpenExams] = useState(false);
        const [tests, setTests] = useState([]);
        const [indexTest, setIndexTest] = useState(0);
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

        const RenderTestDetails = (props) => {
            const { testDetailDTOS, apply, test } = props;
            const [viewCell, setViewCell] = useState(false);
            const [openSubmit, setOpenSubmit] = useState(false);
            const [testDetails, setTestDetails] = useState(testDetailDTOS);
            const [testDetailsCurrent, setTestDetailsCurrent] = useState();
            const timeRef = useRef();

            const handleSubmitClick = (apply, test) => {
                const scoreNoteOptions = [
                    { score: 3, note: 'Chưa tốt', status: 'Rớt' },
                    { score: 0, note: 'Gian lận', status: 'Rớt' },
                    { score: 8, note: 'Tốt', status: 'Đậu' },
                    { score: 6, note: 'Bình thường', status: 'Rớt' },
                    { score: 9, note: 'Tốt', status: 'Đậu' },
                ];

                function getRandomValue(array) {
                    return array[Math.floor(Math.random() * array.length)];
                }

                const randomScoreNote = getRandomValue(scoreNoteOptions);

                const exam = {
                    jobApplyId: apply.jobApplyId,
                    testId: test.testId,
                    score: randomScoreNote.score,
                    note: randomScoreNote.note,
                    status: randomScoreNote.status,
                };

                const responsePromise = requestAuth.post(
                    '/exam/create',
                    JSON.stringify({
                        examDTOS: [exam],
                        jobApplyId: apply.jobApplyId,
                        testId: test.testId,
                    }),
                );

                const idToats = toast.promise(responsePromise, {
                    loading: (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Đang tính toán...
                        </Box>
                    ),
                    success: (data) => {
                        setOpenTest(false);
                        const newTests = tests.filter(
                            (testR) => testR.testId !== test.testId,
                        );
                        const exams = newTests.map((test) => test.examDTO);
                        if (
                            !exams.some(
                                (item) => item === null || item === undefined,
                            )
                        ) {
                            const newApply = {
                                ...apply,
                                status: 'Đang kiểm tra',
                            };
                            const responsePromise = requestAuth.put(
                                '/apply/update',
                                JSON.stringify(newApply),
                            );
                            if (responsePromise) {
                                const idToats = toast.promise(responsePromise, {
                                    loading: 'Đang xử lý...',
                                    success: (data) => {
                                        dispatch(setApply(newApply));
                                        check(newApply);
                                        return NotifierSnackbar({
                                            title: 'Thành công ',
                                            sub1: `${statusApply.value} thành công!`,
                                            toast: toast,
                                            idToats: idToats,
                                        });
                                    },
                                    error: (e) => {
                                        const responseErr = e?.response.data;
                                        const code = e.code;
                                        let message;
                                        if (code === 'ERR_NETWORK') {
                                            message = e.message;
                                        } else if (code === 'ERR_BAD_REQUEST') {
                                            message = responseErr.message;
                                            console.log('Errrr', message);
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
                                });
                            }
                        }

                        return NotifierSnackbar({
                            title: 'Thành công ',
                            sub1: `Thi thành công!`,
                            toast: toast,
                            idToats: idToats,
                        });
                    },
                    error: (e) => {
                        console.log(e);
                        const responseErr = e?.response.data;
                        const code = e.code;
                        let message;
                        if (code === 'ERR_NETWORK') {
                            message = e.message;
                        } else if (code === 'ERR_BAD_REQUEST') {
                            message = responseErr.message;
                            console.log('Errrr', message);
                        }
                        return NotifierSnackbar({
                            title: 'Thất bại',
                            sub1: 'Thi thất bại!',
                            sub2: message,
                            toast: toast,
                            idToats: idToats,
                            type: 'error',
                        });
                    },
                });
            };

            function TabPanel(props) {
                const { children, value, index, ...other } = props;

                return <div {...other}>{children}</div>;
            }

            TabPanel.propTypes = {
                children: PropTypes.node,
                index: PropTypes.number.isRequired,
                value: PropTypes.number.isRequired,
            };

            const theme = useTheme();
            const [valuePanal, setValuePanal] = useState(0);
            const [index, setIndex] = useState(0);

            const handleChangeIndex = (index) => {
                setValuePanal(index);
            };

            const handleConfirmCancelTestClick = (value) => {
                if (value === 'agree') {
                    setViewCell(false);
                    setOpenTestDetails(false);
                } else {
                    timeRef.current.toggle();
                }
            };

            const handleConfirmTestClick = (value) => {
                if (value === 'agree') {
                    setViewCell(true);
                } else {
                    setOpenTestDetails(false);
                }
            };

            const handleTestDetailsChange = (value, testDetailsId) => {
                setTestDetailsCurrent(value);
                setTestDetails((pre) =>
                    pre.map((item) =>
                        item.testDetailsId === testDetailsId
                            ? { ...item, answer: value }
                            : item,
                    ),
                );
            };

            const handleConfirmSubmitClick = (value, apply, test) => {
                if (value === 'agree') {
                    handleSubmitClick(apply, test);
                }
            };

            useEffect(() => {
                if (viewCell) {
                    timeRef.current.toggle();
                }
            }, [viewCell]);

            useEffect(() => {
                setIndex(valuePanal);
            }, [valuePanal]);

            return (
                <div>
                    {!viewCell && (
                        <AlertDialogModalNested
                            minimum={true}
                            onButtonClick={(value) =>
                                handleConfirmTestClick(value)
                            }
                            content="Thông báo qui định làm bài thi"
                            messagePositive="Đồng ý"
                            subContent={
                                <Box>
                                    Bài thi sẽ được lưu trữ vào hệ thống để xét
                                    duyệt.
                                    <Box
                                        sx={{
                                            m: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                        }}
                                    >
                                        <li>Bạn không thể thực hiện lại</li>
                                        <li
                                            style={{
                                                textIndent: '-1.4em',
                                                paddingLeft: '1.4em',
                                            }}
                                        >
                                            Thời gian làm bài là không giới hạn.
                                            Nhưng bạn cần đảm bảo nhanh nhất để
                                            có kết quả tốt so với các ứng viên
                                            còn lại
                                        </li>
                                        <li>
                                            Hồ sơ sẽ được xem xét và thông báo
                                            khi trúng tuyển
                                        </li>
                                    </Box>
                                </Box>
                            }
                            maxWidth="sm"
                        />
                    )}
                    <Dialog
                        fullWidth
                        hideBackdrop
                        maxWidth="sm"
                        keepMounted
                        open={viewCell}
                    >
                        <DialogTitle
                            sx={{
                                fontSize: '1.7rem',
                                marginBottom: 1,
                                fontWeight: 'bold',
                            }}
                        >
                            Bài thi
                        </DialogTitle>
                        <DialogContent>
                            <RenderTime ref={timeRef} />
                        </DialogContent>
                        <DialogContentText>
                            <SwipeableViews
                                animateHeight
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    padding: '5px',
                                    border: '1px solid #e0e0fd',
                                }}
                                axis={
                                    theme.direction === 'rtl'
                                        ? 'x-reverse'
                                        : 'x'
                                }
                                index={valuePanal}
                                onChangeIndex={handleChangeIndex}
                            >
                                {testDetails &&
                                    testDetails.length > 0 &&
                                    testDetails.map((exam, index) => (
                                        <TabPanel
                                            key={index}
                                            value={valuePanal}
                                            index={index}
                                            dir={theme.direction}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                }}
                                            >
                                                <Box sx={{ m: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {`Câu hỏi ${
                                                            index + 1
                                                        }: ${exam.question}`}
                                                    </Typography>
                                                    <TextField
                                                        onChange={(e) =>
                                                            handleTestDetailsChange(
                                                                e.target.value,
                                                                exam.testDetailsId,
                                                            )
                                                        }
                                                        value={
                                                            testDetailsCurrent
                                                        }
                                                        sx={{
                                                            width: '100%',
                                                            marginBootom:
                                                                '20px',
                                                            maxWidth: '150px',
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </TabPanel>
                                    ))}

                                {testDetails && testDetails.length === 0 && (
                                    <>Chưa có câu hỏi cho bài thi!</>
                                )}
                            </SwipeableViews>

                            {testDetails.length > 0 && (
                                <DialogActions
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                    }}
                                >
                                    <Button
                                        sx={{
                                            float: 'left',
                                        }}
                                        variant="outlined"
                                        onClick={() => {
                                            setValuePanal((pre) => pre - 1);
                                        }}
                                    >
                                        Trở lại
                                    </Button>
                                    <Button
                                        sx={{
                                            float: 'right',
                                        }}
                                        variant="outlined"
                                        onClick={() => {
                                            if (
                                                index !==
                                                testDetails.length - 1
                                            ) {
                                                setValuePanal((pre) => pre + 1);
                                            } else {
                                                setOpenSubmit(true);
                                            }
                                        }}
                                    >
                                        {index !== testDetails.length - 1
                                            ? 'Tiếp tục'
                                            : 'Nộp bài'}
                                    </Button>
                                    <div>
                                        {openSubmit && (
                                            <AlertDialogModalNested
                                                minimum={true}
                                                status="success"
                                                onButtonClick={(value) =>
                                                    handleConfirmSubmitClick(
                                                        value,
                                                        apply,
                                                        test,
                                                    )
                                                }
                                                subContent={
                                                    <Box>
                                                        Xác nhận nộp bài thi!
                                                    </Box>
                                                }
                                                content="Bạn chắc chắn nộp bài thi"
                                                messagePositive="Đồng ý"
                                                onClose={(v) =>
                                                    setOpenSubmit(false)
                                                }
                                                maxWidth="sm"
                                            />
                                        )}
                                    </div>
                                </DialogActions>
                            )}
                        </DialogContentText>
                        <DialogActions>
                            {viewCell && (
                                <AlertDialogModalNested
                                    onClick={(e) => {
                                        timeRef.current.toggle();
                                    }}
                                    textIcon="Hủy làm bài"
                                    onButtonClick={(value) => {
                                        handleConfirmCancelTestClick(value);
                                    }}
                                    content="Bạn đã chắc chắn hủy"
                                    messagePositive="Đồng ý"
                                    subContent={
                                        <Box>
                                            Thông tin bài làm sẽ bị mất!
                                            <Box
                                                sx={{
                                                    m: 1,
                                                }}
                                            >
                                                <li>
                                                    Bạn không thể thực hiện lại
                                                </li>
                                                <li>
                                                    Hồ sơ sẽ được xem xét lại
                                                    nếu đủ điều kiện
                                                </li>
                                            </Box>
                                        </Box>
                                    }
                                    maxWidth="sm"
                                />
                            )}
                        </DialogActions>
                    </Dialog>
                </div>
            );
        };

        const RenderExam = (props) => {
            const { test, exam } = props;
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <Box sx={{ m: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`Bài thi: ${test.name}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {`Điểm số: ${exam.score}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {`Ghi chú: ${exam.note}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {`Trạng thái: ${exam.status}`}
                        </Typography>
                    </Box>
                </Box>
            );
        };

        const handleConfirmTestClick = (value) => {
            if (value === 'agree') {
                setViewCell(true);
            } else {
                setOpenTest(false);
            }
        };

        const getTests = async (postId) => {
            try {
                const response = await getTestsByPostsApi(
                    requestAuth,
                    postId,
                    studentId,
                );

                const code = response.status;
                const data = response.data;

                if (code === 200) {
                    const newData = data.testDTOS;
                    setTests(newData);
                }
            } catch (error) {
                console.log('TESTS_ERROR');
            }
        };

        useEffect(() => {
            getTests(post.postApplyId);
        }, [post]);

        return (
            <div>
                {openConfirm && (
                    <AlertDialogModalNested
                        minimum={true}
                        onButtonClick={(value) => handleConfirmTestClick(value)}
                        content="Thông báo quy định bài thi"
                        messagePositive="Đồng ý"
                        subContent={
                            <Box>
                                Bài thi sẽ được lưu trữ vào hệ thống để xét
                                duyệt.
                                <Box
                                    sx={{
                                        m: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <li
                                        style={{
                                            textIndent: '-1.4em',
                                            paddingLeft: '1.4em',
                                        }}
                                    >
                                        Có thể thực hiện từng bài thi riêng
                                        biệt. Nhưng hãy đảm bảo nhanh chóng hoàn
                                        thành để được xét duyệt ưu tiên!
                                    </li>

                                    <li>
                                        Hồ sơ sẽ được xem xét và thông báo khi
                                        trúng tuyển
                                    </li>
                                </Box>
                            </Box>
                        }
                        maxWidth="sm"
                    />
                )}

                <Dialog
                    fullWidth
                    hideBackdrop
                    maxWidth="md"
                    keepMounted
                    open={viewCell}
                    sx={{
                        borderRadius: 5,
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontSize: '1.7rem',
                            marginBottom: 1,
                            fontWeight: 'bold',
                        }}
                    >
                        Bài thi
                    </DialogTitle>
                    <DialogContent>Thông tin bài thi</DialogContent>
                    <DialogContentText
                        sx={{
                            ml: 5,
                            mr: 5,
                        }}
                    >
                        <div
                            style={{
                                padding: 5,
                                display: 'flex',
                                rowGap: 10,
                                columnGap: 15,
                            }}
                        >
                            {tests.map((test, i) => {
                                const { testDetailDTOS, examDTO } = test;

                                return (
                                    <Card
                                        sx={{
                                            maxWidth: '40%',
                                            flex: 1,
                                        }}
                                        key={i}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h5"
                                                component="div"
                                            >
                                                Bài thi: {test.name}
                                            </Typography>
                                            <Typography
                                                sx={{ mb: 2 }}
                                                variant="body1"
                                            >
                                                Bài thi cho vị trí: {}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Thời gian thi: {test.time}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Số lượng câu hỏi:{' '}
                                                {testDetailDTOS?.length ?? 0}
                                            </Typography>
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                            }}
                                        >
                                            <Button
                                                variant={
                                                    examDTO
                                                        ? 'outlined'
                                                        : 'contained'
                                                }
                                                size="small"
                                                onClick={() => {
                                                    if (examDTO) {
                                                        setOpenExams(true);
                                                    } else {
                                                        setOpenTestDetails(
                                                            true,
                                                        );
                                                    }
                                                    setIndexTest(i);
                                                }}
                                            >
                                                {examDTO ? 'Xem' : 'Thi'}
                                            </Button>
                                            {openExams &&
                                                examDTO &&
                                                i === indexTest && (
                                                    <AlertDialogModalNested
                                                        minimum={true}
                                                        content="Thông tin điểm thi"
                                                        messagePositive="Đồng ý"
                                                        subContent={
                                                            <RenderExam
                                                                test={test}
                                                                exam={examDTO}
                                                            />
                                                        }
                                                        onClose={(v) =>
                                                            setOpenExams(false)
                                                        }
                                                        hideNegative={true}
                                                        maxWidth="sm"
                                                    />
                                                )}
                                            {openTestDetails &&
                                                i === indexTest && (
                                                    <RenderTestDetails
                                                        apply={apply}
                                                        testDetailDTOS={
                                                            testDetailDTOS
                                                        }
                                                        test={test}
                                                    />
                                                )}
                                        </CardActions>
                                    </Card>
                                );
                            })}
                            {tests.length === 0 && (
                                <>Chưa có bài thi cho tin đăng này!</>
                            )}
                        </div>
                    </DialogContentText>
                    <DialogActions>
                        <Button
                            sx={{
                                float: 'left',
                            }}
                            variant="outlined"
                            onClick={() => {
                                setViewCell(false);
                                setOpenTest(false);
                            }}
                        >
                            Trở lại
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    const RenderTextFormInterView = (props) => {
        const { id, open, enterprise } = props;
        const [mount, setMount] = useState(false);
        const [viewCell, setViewCell] = useState(open);
        const [interview, setInterview] = useState(null);
        const [address, setAddress] = useState(null);
        const [time, setTime] = useState(null);
        const [type, setType] = useState(null);

        const getInfoInterView = async (id) => {
            try {
                const response = await requestAuth.get(
                    '/interview_info/by_post_apply',
                    {
                        params: {
                            postId: id,
                        },
                    },
                );

                const dataResponse = response.data;
                const code = dataResponse.status;
                const data = dataResponse.data;

                if (code === 200) {
                    setInterview(data);
                }
            } catch (error) {
                console.log('INTERVIEW_INFO: ERROR');
            }
        };

        useEffect(() => {
            if (!mount) {
                getInfoInterView(id);
                setMount(true);
            }
        }, [id, mount]);

        useEffect(() => {
            if (interview) {
                setAddress(interview?.location);
                setTime(interview?.time);
                setType(interview?.type);
            }
        }, [interview]);

        return (
            <Dialog
                fullWidth
                hideBackdrop
                maxWidth="sm"
                keepMounted
                open={viewCell}
            >
                <DialogTitle
                    sx={{
                        fontSize: '1.7rem',
                        marginBottom: 1,
                        fontWeight: 'bold',
                    }}
                >
                    Phỏng vấn
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            fontSize: '1.6rem',
                            marginBottom: 2,
                        }}
                    >
                        Xem thông tin phỏng vấn
                    </DialogContentText>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 5,
                            paddingLeft: 2,
                            marginBottom: 10,
                        }}
                    >
                        <div>
                            <h5>Địa điểm phỏng vấn</h5>
                            <TextField
                                sx={{
                                    m: 1,
                                    width: '80%',
                                }}
                                disabled
                                value={address}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                }}
                            >
                                <h5>Thời gian phỏng vấn</h5>
                                <TimeField
                                    disabled
                                    sx={{ m: 1 }}
                                    value={dayjs(time, 'HH:mm')}
                                />
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                }}
                            >
                                <h5>Hình thức phỏng vấn</h5>
                                <Autocomplete
                                    disabled
                                    disablePortal
                                    id="combo-box-contract"
                                    options={['Trực tiếp', 'Meeting', 'Call']}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                    value={type}
                                />
                            </div>
                        </div>
                    </div>

                    <h5>Thông tin công ty</h5>
                    <Accordion
                        sx={{
                            mb: 1,
                            width: '80%',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography
                                gutterBottom
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}
                            >
                                {`Công ty: ${enterprise?.name}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {`Địa chỉ: ${enterprise?.address}`}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <Box sx={{ m: 1 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Số điện thoại: ${enterprise?.phone}`}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {`Email: ${enterprise?.email}`}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.primary">
                                Mô tả
                                <ReactQuill
                                    className="view-text"
                                    readOnly
                                    value={enterprise?.description}
                                />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setViewCell(false);
                            setOpenInterview(false);
                        }}
                    >
                        Quay lại
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    function FileUpload(props) {
        const { open = false, fk } = props;

        const [viewCell, setViewCell] = useState(open);
        const [uploadProgress, setUploadProgress] = useState(0);
        const [introduce, setIntroduce] = useState('');
        const [file, setFile] = useState('');
        const [cv, setCV] = useState({});

        const handleFileUpload = () => {
            let date = dayjs().format('DD/MM/YYYY');
            console.log(date);
            let formData = new FormData();
            formData.append('file', file);
            formData.append('cv', JSON.stringify(cv));
            formData.append('introduce', introduce);
            formData.append('dateApply', date);
            formData.append('status', 'Đang xử lý');
            formData.append('studentID', fk?.studentId);
            formData.append('postID', fk?.postApplyId);

            const responsePromise = requestAuth.post(
                '/apply/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        let percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        setUploadProgress(percentCompleted);
                    },
                },
            );

            const idToats = toast.promise(responsePromise, {
                loading: (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={uploadProgress}
                            />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >{`${uploadProgress}%`}</Typography>
                        </Box>
                    </Box>
                ),
                success: (data) => {
                    dispatch(setApply(data.data.data));
                    check(data.data.data);
                    setNumberSubmit((pre) => pre + 1);
                    return NotifierSnackbar({
                        title: 'Thành công ',
                        sub1: `Ứng tuyển thành công!`,
                        toast: toast,
                        idToats: idToats,
                    });
                },
                error: (e) => {
                    console.log(e);
                    const responseErr = e?.response?.data;
                    const code = e.code;
                    let message;
                    if (code === 'ERR_NETWORK') {
                        message = e.message;
                    } else if (code === 'ERR_BAD_REQUEST') {
                        message = responseErr.message;
                        console.log('Errrr', message);
                    }
                    return NotifierSnackbar({
                        title: 'Thất bại',
                        sub1: 'Ứng tuyển thất bại!',
                        sub2: message,
                        toast: toast,
                        idToats: idToats,
                        type: 'error',
                    });
                },
            });
        };

        const handleConfirmSaveClick = async (value) => {
            if (value === 'agree') {
                handleFileUpload();
            }
        };

        const handleFileChange = (event) => {
            let file = event.target.files[0];
            let fileName = file.name;
            let fileExtension = fileName.split('.').pop();

            const typeFile = {
                extension: fileExtension,
            };
            setFile(file);
            setCV({
                name: fileName,
                typeFile: typeFile,
            });
        };

        const handleConfirmTestClick = (value) => {
            if (value === 'agree') {
                setViewCell(true);
            } else {
                setOpenApply(false);
                setViewCell(false);
            }
        };

        return (
            <div>
                <AlertDialogModalNested
                    minimum={true}
                    onButtonClick={(value) => handleConfirmTestClick(value)}
                    content="Thông báo quy định ứng tuyển"
                    messagePositive="Đồng ý"
                    subContent={
                        <Box>
                            Hệ thống xét duyệt đầu vào dựa trên kết quả các khóa
                            học gần đây để đảm bảo yêu cầu chất lượng. Bạn đồng
                            ý cho phép cung cấp thông tin các khóa học cho doanh
                            nghiệp để theo dõi?
                            <Box
                                sx={{
                                    m: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <li>Thông tin học phần!</li>

                                <li>Thông tin điểm thi học phần!</li>
                            </Box>
                        </Box>
                    }
                    maxWidth="sm"
                />
                {viewCell && (
                    <AlertDialogModal
                        minimum={open}
                        onClose={(value) => {
                            setOpenApply(false);
                            setViewCell(false);
                        }}
                        status="success"
                        maxWidth="sm"
                        keepMounted={true}
                        disabledPositive={!file || !introduce}
                        headerTitle="Cập nhật thông tin"
                        content={
                            <div>
                                <Box
                                    sx={{
                                        m: 1,
                                    }}
                                >
                                    <TextField
                                        sx={{ m: 1 }}
                                        type="file"
                                        label="Tải lên CV"
                                        color="secondary"
                                        focused
                                        onChange={handleFileChange}
                                        inputProps={{
                                            accept: '.doc,.docx,.pdf,.txt',
                                        }}
                                    />

                                    <ReactQuill
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === 'Tab'
                                            ) {
                                                event.stopPropagation();
                                            }
                                        }}
                                        value={introduce}
                                        onChange={setIntroduce}
                                        placeholder="Giới thiệu chung"
                                    />
                                </Box>
                            </div>
                        }
                        onButtonClick={(value) => handleConfirmSaveClick(value)}
                    />
                )}
            </div>
        );
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

    const MenuOptions = (props) => {
        const { anchor } = props;
        const [anchorEl, setAnchorEl] = React.useState(anchor);
        const open = Boolean(anchorEl);

        const handleClose = () => {
            setAnchorEl(null);
            setAnchor(null);
        };

        return (
            <Fragment>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>
                        <Button
                            disabled={!statusApply.access}
                            color="success"
                            variant="contained"
                            startIcon={<FcAcceptDatabase />}
                            // onClick={() => {

                            // }}
                        >
                            Chấp nhận công việc
                        </Button>
                    </MenuItem>
                    <Divider />

                    <MenuItem onClick={handleClose}>
                        <Button
                            disabled={!statusApply.access}
                            color="warning"
                            variant="outlined"
                            startIcon={<ImCancelCircle />}
                            // onClick={() => {

                            // }}
                        >
                            Từ chối công việc
                        </Button>
                    </MenuItem>
                    <Divider />
                </Menu>
            </Fragment>
        );
    };

    const check = useCallback(
        (apply) => {
            let note;
            if (noteStatusPost === 'Đang chờ duyệt') {
                note = 'Bài đăng đang được duyệt, quay lại sau nhé!';
            }
            if (noteStatusPost === 'Từ chối') {
                note = 'Bài đăng đang không hoạt động, tìm công việc khác nhé!';
            }

            if (!apply) {
                const { classes, amountCompatibility } = classesPostStudent;
                if (!classes || classes.length === 0) {
                    setStatusApply({
                        status: 'none',
                        value: 'Chưa phù hợp',
                        note: (
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        paddingLeft: 5,
                                        flexDirection: 'column',
                                        gap: 5,
                                        maxHeight: 150,
                                        overflowY: 'auto',
                                    }}
                                >
                                    <div>
                                        Bạn chưa học khóa học nào phù hợp với vị
                                        trí {nameJob}!
                                    </div>
                                    <div>
                                        Có thể tham gia các khóa học dưới đây để
                                        có thể ứng tuyển công việc này:
                                    </div>
                                    <div
                                        style={{
                                            paddingLeft: 10,
                                            paddingRight: 5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 5,
                                        }}
                                    >
                                        {classesPosition.map((classP) => (
                                            <>
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        mr: 1,
                                                    }}
                                                    fontSize={13}
                                                    color="black !important"
                                                >
                                                    {classP.name}
                                                </Box>
                                            </>
                                        ))}
                                    </div>

                                    <div>
                                        Bạn cần tham gia đủ 2/3 thời gian các
                                        lớp học. Hãy quay lại sau nhé!
                                    </div>
                                </div>
                            </div>
                        ),
                        access: false,
                        icon: <IoNavigateCircle />,
                    });
                } else {
                    if (amountCompatibility === 0) {
                        setStatusApply({
                            status: 'none',
                            value: 'Chưa phù hợp',
                            note: (
                                <div
                                    style={{
                                        display: 'flex',
                                        paddingLeft: 5,
                                        flexDirection: 'column',
                                        gap: 5,
                                        maxHeight: 150,
                                        overflowY: 'auto',
                                    }}
                                >
                                    <div>
                                        Các lớp học phù hợp với vị trí tuyển
                                        dụng mà bạn đang học:
                                    </div>
                                    <div
                                        style={{
                                            paddingLeft: 10,
                                            paddingRight: 5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 5,
                                        }}
                                    >
                                        {classes.map((classP) => (
                                            <>
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        mr: 1,
                                                    }}
                                                    fontSize={13}
                                                    color="black !important"
                                                >
                                                    {classP.name}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <LinearProgress
                                                            color={
                                                                classP?.progress >=
                                                                (2 / 3) * 100
                                                                    ? 'success'
                                                                    : classP.progress >
                                                                      0
                                                                    ? 'warning'
                                                                    : 'error'
                                                            }
                                                            variant="determinate"
                                                            value={
                                                                classP?.progress >
                                                                0
                                                                    ? classP?.progress
                                                                    : 0
                                                            }
                                                        />
                                                    </Box>
                                                    <Box sx={{ minWidth: 35 }}>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >{`${Math.round(
                                                            classP?.progress,
                                                        )}%`}</Typography>
                                                    </Box>
                                                </Box>
                                            </>
                                        ))}
                                    </div>

                                    <div>
                                        Bạn cần tham gia đủ 2/3 thời gian các
                                        lớp học. Hãy quay lại sau nhé!
                                    </div>
                                </div>
                            ),
                            access: false,
                            icon: <IoNavigateCircle />,
                        });
                    } else {
                        setStatusApply({
                            status: 'init',
                            value: 'Ứng tuyển',
                            note: note,
                            access: note ? false : true,
                            icon: <IoNavigateCircle />,
                        });
                    }
                }
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
                    value: 'Xác nhận công việc',
                    note: note,
                    access: note ? false : true,
                    icon: <ImCancelCircle />,
                });
                // FcAcceptDatabase
            }
        },
        [classesPostStudent, nameJob, noteStatusPost],
    );

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

        getContractDetailsByPostApply(postApplyId);
        console.log('CONTRACT_DETAIL');
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

        const getClassWithPosition = async (positionId) => {
            try {
                const response = await getClassByPositionApi(
                    requestAuth,
                    positionId,
                );

                const status = response?.status;
                const data = response?.data;

                if (status === 200) {
                    dispatch(setClassesPosition(data));
                }
            } catch (e) {
                console.log('COURSE_ERROR');
            }
        };

        if (position) {
            getCourseWithPosition(position.positionId);
            //getClassWithPosition(position.positionId);
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
    }, [apply, checkRequest, dispatch, job.postApplyId, requestAuth]);

    useEffect(() => {
        const getClassByPostApplyAndStudent = async () => {
            try {
                const response = await getClassesByPostApplyAndStudentApi(
                    requestAuth,
                    job.postApplyId,
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
        if (!checkRequest) {
            getClassByPostApplyAndStudent();
        }
    }, [
        checkRequest,
        classesPostStudent,
        dispatch,
        job.postApplyId,
        requestAuth,
        studentId,
    ]);

    useEffect(() => {
        check(apply);
    }, []);

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
    }, [info]);

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
                            color={
                                statusApply.status === 'init'
                                    ? 'success'
                                    : 'info'
                            }
                            variant="contained"
                            startIcon={statusApply.icon}
                            onClick={(e) => {
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
                                    setOpenTest(true);
                                } else if (statusApply.status === 'test') {
                                    setOpenTest(true);
                                } else if (statusApply.status === 'interview') {
                                    setOpenInterview(true);
                                } else if (statusApply.status === 'job') {
                                    setAnchor(e.currentTarget);
                                }

                                if (responsePromise) {
                                    const idToats = toast.promise(
                                        responsePromise,
                                        {
                                            loading: 'Đang xử lý...',
                                            success: (data) => {
                                                if (
                                                    statusApply.status ===
                                                        'apply' ||
                                                    statusApply.status ===
                                                        'agree'
                                                ) {
                                                    setNumberSubmit(
                                                        (pre) => pre - 1,
                                                    );
                                                }

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
                        {openApply && (
                            <FileUpload
                                open={openApply}
                                fk={{
                                    studentId: studentId,
                                    postApplyId: job.postApplyId,
                                }}
                            />
                        )}
                        <RenderTextFormInterView
                            enterprise={enterprise}
                            open={openInterview}
                            id={job.postApplyId}
                        />
                        {openTest && (
                            <RenderTest
                                post={job}
                                openConfirm={statusApply.status !== 'test'}
                            />
                        )}

                        {anchor && <MenuOptions anchor={anchor} />}

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
                                    secondary={nameJob.split('-')[0]}
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
                                    secondary={
                                        amount - numberSubmit === 0
                                            ? 'Đã hết'
                                            : amount - numberSubmit
                                    }
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
