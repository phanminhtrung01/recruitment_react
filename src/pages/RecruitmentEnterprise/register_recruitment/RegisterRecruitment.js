import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useImperativeHandle,
    Fragment,
} from 'react';

import { useNavigate } from 'react-router-dom';

import './RegistrationPage.scss';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
// import {Search} from '@mui/material/icons'
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Tippy from '@tippyjs/react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Accordion from '@mui/material/Accordion';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CloseOutlined, RefreshOutlined } from '@mui/icons-material';

import useRequestAuth from '../../../hooks/useRequestAuth';

import { Document, Page, View, Text, PDFViewer } from '@react-pdf/renderer';
import { StyleSheet, Font } from '@react-pdf/renderer';

import { useDispatch, useSelector } from 'react-redux';
import {
    setName,
    setCurrentPosition,
    setCurrentPositionAmount,
    setCurrentPositionComis,
    setPositions,
    setPositionsFromEmpty,
    setEndDate,
    setContractAllowed,
    setOldApplicantsAllowed,
    resetContract,
} from '../../../redux/contractSlice';
import SnackbarCustom from '../../../components/snackbar';
import {
    AlertTitle,
    Dialog,
    Divider,
    List,
    ListItem,
    ListItemText,
    Slide,
} from '@mui/material';
import { Toaster, toast } from 'sonner';
import NotifierSnackbar from '../../../components/Notification/notifier-error';
import {
    getClassByPositionApi,
    positionsByEnterpriseApi,
} from '../../../api/auth';
import { resetAuth } from '../../../redux/authSlice';

const Registration = () => {
    const navigate = useNavigate();

    const requestAuth = useRequestAuth();

    const dispatch = useDispatch();

    const today = dayjs();
    const tomorrow = today.add(1, 'day');

    const [startDate, setStartDateContract] = useState(today);
    const [endDate, setEndDateContract] = useState(tomorrow);

    const [statusContract, setStatusContract] = useState('failure');
    const [statusEndDate, setStatusEndDate] = useState('failure');
    const [statusJobs, setStatusJobs] = useState('failure');

    const handleNavigateClick = (e, contract) => {
        e.preventDefault();
        const { name, date, positions, oldApplicantsAllowed } = contract;
        const { startDate, endDate } = date;
        const positionsData = positions.map((pos) => ({
            positionId: pos.position.positionId,
            amount: +pos.amount,
            comis: +pos.comis,
        }));

        const data = {
            name: name,
            createDate: dayjs().format('DD/MM/YYYY'),
            effectiveDate: dayjs(startDate).format('DD/MM/YYYY'),
            terminationDate: dayjs(endDate).format('DD/MM/YYYY'),
            contractDetailDTOList: positionsData,
            isOld: oldApplicantsAllowed,
        };

        const responsePromise = requestAuth.post(
            '/contract/create_auth',
            JSON.stringify(data),
        );

        const idToats = toast.promise(responsePromise, {
            loading: 'Đang kiểm tra ...',
            success: (data) => {
                setTimeout(() => {
                    navigate('../contract', { replace: true });
                }, 2500);

                dispatch(resetContract());
                return NotifierSnackbar({
                    title: 'Thành công ',
                    sub1: 'Đăng ký hợp đồng tuyển dụng thành công!',
                    sub2: 'Chú ý trạng thái hợp đồng để tuyển dụng',
                    toast: toast,
                    idToats: idToats,
                });
            },
            error: (e) => {
                setStatusContract('failure');
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
                    sub1: 'Đăng ký hợp đồng tuyển dụng không thành công!',
                    sub2: message,
                    toast: toast,
                    idToats: idToats,
                    type: 'error',
                });
            },
        });
    };

    const handleStartDateChange = (event) => {
        setStartDateContract(event.target.value);
    };

    const handleEndDateChange = (newValue) => {
        setEndDateContract(newValue);
    };

    const handleTimeSubmit = ({ action }) => {
        const result = timeRowRef.current.map((item, i) => {
            const checkedIndex = item.value;
            if (checkedIndex) {
                return item.day;
            }
            return null;
        });

        function isValidDate(dateString) {
            let [day, month, year] = dateString.split('/');
            let timestamp = Date.parse(`${month}/${day}/${year}`);

            return !isNaN(timestamp);
        }

        let timestamps = result.map((date) => {
            if (date) {
                let [day, month, year] = date.split('/');
                return Date.parse(`${month}/${day}/${year}`);
            } else {
                return -Infinity;
            }
        });

        let maxTimestamp = Math.max.apply(null, timestamps);

        let maxDate = new Date(maxTimestamp).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        console.log(maxDate);
        if (!dayjs(maxDate, 'DD/MM/YYYY').isValid()) {
            maxDate = tomorrow;
        }

        setEndDateContract(dayjs(maxDate, 'DD/MM/YYYY'));
    };

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const timeRowRef = useRef([]);

    const Row = React.forwardRef((props, ref) => {
        const { row } = props;

        const { position, amount } = row;
        const [classes, setClasses] = useState([]);

        const updateTimeRef = (checkedTimeCourse) => {
            const times = [...timeRowRef.current];

            const newTimes = times.map((time) => {
                const keys = checkedTimeCourse.map((time) => time.key);
                const index = keys.indexOf(time.key);
                return {
                    ...time,
                    value: checkedTimeCourse[index]?.value ?? time.value,
                };
            });

            timeRowRef.current = newTimes;
        };

        const addTimeRef = (checkedTimeCourse) => {
            const times = [...timeRowRef.current];
            checkedTimeCourse.forEach((element, index) => {
                if (
                    times[index] === undefined ||
                    times[index].key !== element.key
                ) {
                    times.push(element);
                }
            });

            timeRowRef.current = times;
        };

        const RenderPositions = (props) => {
            const { classes } = props;
            const [checkedTimeCourse, setCheckedTimeCourse] = useState([]);

            const handleCheck = (index) => {
                let newChecked = [...checkedTimeCourse];
                newChecked[index].value = !newChecked[index].value;

                if (
                    index === newChecked.length - 1 &&
                    newChecked[index].value
                ) {
                    newChecked = newChecked.map((check) => {
                        return { ...check, key: check.key, value: true };
                    });
                }

                if (
                    index !== newChecked.length - 1 &&
                    newChecked[index].value
                ) {
                    for (let i = 0; i < newChecked.length; i++) {
                        if (i > index) {
                            newChecked[i].value = false;
                        } else {
                            newChecked[i].value = true;
                        }
                    }
                }

                if (index !== newChecked.length - 1 && !newChecked[index]) {
                    for (let i = index + 1; i < newChecked.length; i++) {
                        newChecked[i].value = false;
                    }
                }

                setCheckedTimeCourse(newChecked);
            };

            useEffect(() => {
                updateTimeRef(checkedTimeCourse);
            }, [checkedTimeCourse]);

            useEffect(() => {
                const checked = classes.map((classR) => {
                    return {
                        key: classR.classId,
                        value: true,
                        day: classR.endDate,
                    };
                });
                setCheckedTimeCourse(checked);
                addTimeRef(checked);
            }, [classes]);

            if (classes.length === 0) {
                return (
                    <TableRow key={0}>
                        <TableCell component="th" scope="row">
                            Không có lớp học nào!
                        </TableCell>
                    </TableRow>
                );
            } else {
                return classes.map((courseRow, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {courseRow.name}
                            </TableCell>
                            <TableCell>{courseRow.startDate}</TableCell>
                            <TableCell align="right">
                                {courseRow.endDate}
                            </TableCell>
                            <TableCell align="right">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Checkbox
                                            title="Tự động cập nhật theo khóa học"
                                            color="success"
                                            checked={
                                                checkedTimeCourse[index]
                                                    ?.value ?? true
                                            }
                                            onChange={() => handleCheck(index)}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Theo thời gian khóa học
                                        <Tippy content="Theo khoa hoc nha">
                                            <span> (*)</span>
                                        </Tippy>
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                });
            }
        };

        const getClassByPosition = async (positionId) => {
            try {
                const response = await getClassByPositionApi(
                    requestAuth,
                    positionId,
                );

                const code = response.status;
                const data = response.data;
                if (code === 200) {
                    setClasses(data);
                }
            } catch (error) {
                console.log('GET_CLASS_ERROR');
            }
        };

        const [open, setOpen] = React.useState(false);

        useImperativeHandle(ref, () => ({
            closeCollapse() {
                setOpen(!open);
            },
        }));

        useEffect(() => {
            getClassByPosition(position.positionId);
        }, [position]);

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {position.name}
                    </TableCell>
                    <TableCell align="right">{amount}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                    >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography
                                    variant="h7"
                                    gutterBottom
                                    component="div"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Khóa học phù hợp
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên khóa học</TableCell>
                                            <TableCell>
                                                Thời gian bắt đầu
                                            </TableCell>
                                            <TableCell align="right">
                                                Thời gian kết thúc
                                            </TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <RenderPositions classes={classes} />
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    });

    const PositionSelect = React.forwardRef((props, ref) => {
        const [openSelect, setOpen] = useState(false);
        const [noFilter, setNoFilter] = useState(true);
        const [position, setPosition] = useState(null);
        const [options, setOptions] = useState([]);
        const [fetching, setFetching] = useState(false);

        const { positionsR } = props;
        const positions = positionsR.map((position) => position.position);

        useImperativeHandle(ref, () => ({
            setNull() {
                setPosition(null);
            },
            setOptions(optionsPar) {
                setOptions(optionsPar);
            },
            getOptions() {
                return options;
            },
        }));

        useEffect(() => {
            if (position) {
                dispatch(setCurrentPosition(position));
            }
        }, [position]);

        useEffect(() => {
            if (openSelect) {
                const getPosition = async () => {
                    try {
                        const response = await positionsByEnterpriseApi(
                            requestAuth,
                        );

                        const status = response.status;

                        if (status === 200) {
                            const data = response.data;
                            filter(data);
                        }
                    } catch (e) {
                        console.log('POSITION_ERROR');
                    }
                };

                setFetching(true);

                getPosition();

                setFetching(false);
            }
            //console.log(openSelect);
        }, [openSelect]);

        const filter = useCallback(
            (data) => {
                let result = data.filter(
                    (item) =>
                        !positions
                            .map((pos) => pos.positionId)
                            .includes(item.positionId),
                );

                setOptions(result);
            },
            [positions],
        );

        useEffect(() => {
            if (options.length === 0) {
                setNoFilter(false);
            }
        }, [options]);

        return (
            <Autocomplete
                id="position-select-lazy"
                open={openSelect}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                getOptionLabel={(option) => option.name}
                options={options}
                loading={fetching}
                autoComplete
                value={position}
                noOptionsText={
                    noFilter ? 'Không có vị trí phù hợp' : 'Đã hết lụa chọn!'
                }
                onChange={(event, newValue) => {
                    setPosition(newValue);
                    setFetching(false);
                }}
                onInputChange={(event, value, reason) => {
                    if (reason === 'clear') {
                        dispatch(setCurrentPosition(null));
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Chọn vị trí"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {fetching ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                    ) : (
                                        openSelect && (
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => setOptions([])}
                                            >
                                                <RefreshOutlined />
                                            </IconButton>
                                        )
                                    )}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            ),
                        }}
                    />
                )}
                isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                }
            />
        );
    });

    const SelectAmount = React.forwardRef((props, ref) => {
        const [amount, setAmount] = useState(0);

        const handleAmountChange = (event) => {
            setAmount(event.target.value);
        };

        useImperativeHandle(ref, () => ({
            setNull() {
                setAmount(0);
            },
        }));

        useEffect(() => {
            if (amount) {
                dispatch(setCurrentPositionAmount(amount));
            }
        }, [amount]);

        return (
            <TextField
                id="standard-basic"
                sx={{ minWidth: '40%', width: '50%' }}
                label="Số lượng"
                type="number"
                value={amount}
                inputProps={{
                    min: 1,
                    step: 1,
                    pattern: '\\d+',
                    onInput: function (e) {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                            .toString()
                            .replace(/[^0-9]/g, '');
                    },
                }}
                onChange={handleAmountChange}
            />
        );
    });

    function ContractDetails() {
        const [submitPosition, setSubmitPosition] = useState(false);
        const [filterComis, setFilterComis] = useState(false);

        const positionRef = useRef();
        const amountRef = useRef();

        const positionR = useSelector(
            (state) => state.contract?.value?.currentSelectPosition,
        );
        const positionsR = useSelector(
            (state) => state.contract?.value?.positions,
        );

        const { position, amount } = positionR;

        const handleComisChange = (event) => {
            setFilterComis(event.target.value);
        };

        const handleAddPosition = () => {
            dispatch(setCurrentPosition(null));
            dispatch(setCurrentPositionAmount(0));
            dispatch(setPositions(positionR));
            positionRef.current?.setNull(null);
            amountRef.current?.setNull(0);

            if (positionR.length === 0) {
                setStatusJobs('failure');
            } else {
                setStatusJobs('success');
            }

            setSubmitPosition(false);
        };

        useEffect(() => {
            if (filterComis) {
                dispatch(setCurrentPositionComis(+filterComis));
            }
        }, [filterComis]);

        useEffect(() => {
            if (position && amount > 0 && filterComis) {
                setSubmitPosition(true);
            } else {
                setSubmitPosition(false);
            }
        }, [position, amount, filterComis]);

        return (
            <div
                className={`register-contract jobs ${
                    submitPosition ? 'success' : 'failure'
                }`}
            >
                <h5>Các vị trí cần tuyển dụng</h5>
                <form id="form-register-position">
                    <div className="select-position">
                        <PositionSelect
                            positionsR={positionsR}
                            ref={positionRef}
                        />

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 20,
                            }}
                        >
                            <SelectAmount ref={amountRef} />

                            <TextField
                                label="Tiền hoa hồng"
                                onChange={handleComisChange}
                                value={filterComis}
                                sx={{ width: '80%' }}
                                type="number"
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                    max: 100,
                                    pattern: '\\d+',
                                    onInput: function (e) {
                                        e.target.value = Math.max(
                                            0,
                                            parseInt(e.target.value),
                                        )
                                            .toString()
                                            .replace(/[^0-9]/g, '');

                                        e.target.value = Math.min(
                                            100,
                                            parseInt(e.target.value),
                                        )
                                            .toString()
                                            .replace(/[^0-9]/g, '');
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <div style={{ fontSize: '1.3rem' }}>
                                            %
                                        </div>
                                    ),
                                }}
                            />
                        </div>
                        <div className="div-submit">
                            <Button
                                disableRipple
                                variant="contained"
                                style={{
                                    float: 'right',
                                    fontSize: 13,
                                    textTransform: 'none',
                                }}
                                disabled={!submitPosition}
                                onClick={handleAddPosition}
                            >
                                Thêm vị trí
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    function ReviewContract() {
        const contract = useSelector((state) => state.contract.value);
        const { nameContract, positions } = contract;
        const { info } = useSelector((state) => state.infoUser?.value);
        const nameTrainingCenter = 'Trung tâm đào tạo BN';
        const nameEnterprise = info.name;
        const time = dayjs().format('DD-MM-YYYY_HH:mm:ss');
        const [contractName, setContractName] = useState(
            nameTrainingCenter + '_' + nameEnterprise + '_' + time,
        );

        const handleContractNameChange = (event) => {
            setContractName(event.target.value);
        };

        const deleteRow = (position) => {
            dispatch(
                setPositionsFromEmpty(
                    positions.filter(
                        (positionR) =>
                            positionR.position?.positionId !==
                            position.positionId,
                    ),
                ),
            );
        };

        const RecruitmentContractPDF = () => {
            Font.register({
                family: 'Roboto',
                src: '../../../../public/font/Roboto-Black.ttf',
            });

            const styles = StyleSheet.create({
                text: {
                    fontFamily: 'Roboto',
                    fontSize: '1.3rem',
                },
            });

            const [open, setOpen] = React.useState(false);

            const handleClickOpen = () => {
                setOpen(true);
            };

            const handleClose = () => {
                setOpen(false);
            };

            const generatePDF = () => {
                return (
                    <>
                        <Document>
                            <Page pageNumber={1}>
                                <View style={{ padding: 20 }}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            textAlign: 'center',
                                            marginBottom: 20,
                                        }}
                                    >
                                        HỢP ĐỒNG ĐĂNG KÝ TUYỂN DỤNG
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            marginBottom: 10,
                                        }}
                                    >
                                        Ngày tháng năm
                                    </Text>

                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                marginTop: 20,
                                            }}
                                        >
                                            Căn cứ hợp tác giữa:
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            Bên A: [Tên doanh nghiệp của bạn]
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            Bên B: [Tên trung tâm đào tạo]
                                        </Text>
                                    </View>

                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                marginTop: 20,
                                            }}
                                        >
                                            Đã thống nhất và ký kết hợp đồng này
                                            với những điều khoản sau:
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            I. Đối tượng hợp đồng
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            1.1. [Mô tả đối tượng hợp đồng]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            II. Quyền và nghĩa vụ của các bên
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            2.1. Bên A
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 60,
                                            }}
                                        >
                                            [Nội dung quyền và nghĩa vụ của Bên
                                            A]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            2.2. Bên B
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 60,
                                            }}
                                        >
                                            [Nội dung quyền và nghĩa vụ của Bên
                                            B]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            III. Thanh toán và hoa hồng
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            3.1. [Chi tiết về thanh toán và hoa
                                            hồng]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            IV. Thời hạn và chấm dứt hợp đồng
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            4.1. [Quy định về thời hạn và cách
                                            chấm dứt hợp đồng]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            V. Điều khoản chung
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            5.1. [Các điều khoản chung]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            VI. Cam kết của các bên
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            6.1. Bên A cam kết
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 60,
                                            }}
                                        >
                                            [Nội dung cam kết của Bên A]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            6.2. Bên B cam kết
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 60,
                                            }}
                                        >
                                            [Nội dung cam kết của Bên B]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            VII. Hiệu lực và gia hạn
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            7.1. [Quy định về hiệu lực và gia
                                            hạn hợp đồng]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            VIII. Giải quyết tranh chấp
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            8.1. [Quy trình giải quyết tranh
                                            chấp]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 20,
                                            }}
                                        >
                                            IX. Kết luận
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                marginLeft: 40,
                                            }}
                                        >
                                            9.1. [Tổng kết hợp đồng]
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 12,
                                                marginTop: 20,
                                            }}
                                        >
                                            Ngày ký: [Ngày tháng năm]
                                        </Text>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginTop: 40,
                                            }}
                                        >
                                            <Text style={{ fontSize: 14 }}>
                                                BÊN A
                                            </Text>
                                            <Text style={{ fontSize: 14 }}>
                                                BÊN B
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Page>
                        </Document>
                    </>
                );
            };

            return (
                <div>
                    <React.Fragment>
                        <Button
                            variant="outlined"
                            onClick={handleClickOpen}
                            style={{
                                float: 'left',
                                fontSize: 14,
                                textTransform: 'none',
                                width: '20%',
                            }}
                            disabled={statusContract === 'failure'}
                        >
                            Xem trước
                        </Button>
                        <Dialog
                            fullScreen
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Transition}
                        >
                            <AppBar sx={{ position: 'relative' }}>
                                <Toolbar>
                                    <IconButton
                                        edge="start"
                                        color="inherit"
                                        onClick={handleClose}
                                        aria-label="close"
                                    >
                                        <CloseOutlined />
                                    </IconButton>
                                    <Typography
                                        sx={{ ml: 2, flex: 1 }}
                                        variant="h6"
                                        component="div"
                                    >
                                        Trở lại
                                    </Typography>
                                    {/* <Button
                                        autoFocus
                                        color="inherit"
                                        onClick={handleClose}
                                    >
                                        save
                                    </Button> */}
                                </Toolbar>
                            </AppBar>
                            <PDFViewer height="100%" width="100%">
                                {generatePDF()}
                            </PDFViewer>
                        </Dialog>
                    </React.Fragment>
                </div>
            );
        };

        useEffect(() => {
            if (positions.length === 0) {
                setStatusContract('failure');
            }
        }, [positions]);

        useEffect(() => {
            dispatch(setName(contractName));
            if (contractName?.length === 0) {
                setStatusContract('failure');
                setContractName(
                    nameTrainingCenter + '_' + nameEnterprise + '_' + time,
                );
                dispatch(
                    setName(
                        nameTrainingCenter + '_' + nameEnterprise + '_' + time,
                    ),
                );
            }
        }, [contractName]);

        // useEffect(() => {
        //     setContractName(nameContract);
        // }, [nameContract]);

        return (
            <div className={`registration-review ${statusContract}`}>
                <div>
                    <h2>THÔNG TIN HỢP ĐỒNG</h2>

                    <h5>Tên hợp đồng</h5>
                    <TextField
                        onChange={handleContractNameChange}
                        value={contractName}
                        sx={{ width: '80%', marginBottom: '20px' }}
                    />

                    <h5>Vị trí tuyển dụng</h5>
                    <TableContainer
                        component={Paper}
                        sx={{ marginBottom: '20px' }}
                    >
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên vị trí</TableCell>
                                    <TableCell align="right">
                                        Số lượng tuyển dụng
                                    </TableCell>
                                    <TableCell align="right">
                                        Tiền hoa hồng
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {positions.length === 0 ? (
                                    <TableRow>
                                        <TableCell align="center" colSpan={6}>
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    positions.map((row) => (
                                        <TableRow
                                            key={row.position?.positionId}
                                            sx={{
                                                '&:last-child td, &:last-child th':
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {row.position?.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.amount}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.comis}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() =>
                                                        deleteRow(row.position)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="review-time">
                        <div className="time-box">
                            <h5>Ngày bắt đầu dự kiện</h5>
                            <TextField
                                disabled={true}
                                onChange={handleStartDateChange}
                                value={startDate?.format('DD/MM/YYYY')}
                                sx={{
                                    width: '100%',
                                    marginBootom: '20px',
                                    maxWidth: '150px',
                                }}
                            />
                        </div>
                        <div className="time-box">
                            <h5>Ngày kết thúc dự kiện</h5>
                            <TextField
                                disabled={true}
                                onChange={handleEndDateChange}
                                value={endDate?.format('DD/MM/YYYY')}
                                sx={{
                                    width: '100%',
                                    marginBootom: '20px',
                                    maxWidth: '150px',
                                }}
                            />
                        </div>
                    </div>
                    <h5>Điều khoản hợp đồng</h5>

                    <div
                        style={{
                            marginTop: 50,
                        }}
                    >
                        <Button
                            variant="contained"
                            style={{
                                float: 'right',
                                fontSize: 14,
                                textTransform: 'none',
                                width: '20%',
                            }}
                            disabled={statusContract === 'failure'}
                            onClick={(e) => {
                                handleNavigateClick(e, contract);
                            }}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            Đăng ký
                        </Button>

                        <RecruitmentContractPDF />
                        {/* <Button
                            variant="outlined"
                            style={{
                                float: 'left',
                                fontSize: 14,
                                textTransform: 'none',
                                width: '20%',
                            }}
                            disabled={statusContract === 'failure'}
                        >
                            Xem trước
                        </Button> */}
                    </div>
                </div>
            </div>
        );
    }

    function Contract() {
        const [allowTime, setAllowTime] = useState(false);

        const positionsR = useSelector(
            (state) => state.contract?.value?.positions,
        );

        const oldApplicantsAllowed = useSelector(
            (state) => state.contract?.value?.oldApplicantsAllowed,
        );

        function ContractTerm() {
            const contract = useSelector((state) => state.contract.value);
            // const  = useSelector(
            //     (state) => state.contract.value.contractAllowed,
            // );

            const { contractAllowed, positions, name } = contract;

            const [statusTerms, setStatusTerms] = useState('failure');
            const [allowTerms, setAllowTerms] = useState(
                contractAllowed?.index,
            );
            const [radioGroup, setRadioGroup] = useState('just');

            const handleToggle = (value) => () => {
                const currentIndex = allowTerms.indexOf(value);
                const newChecked = [...allowTerms];

                if (currentIndex === -1) {
                    newChecked.push(value);
                } else {
                    newChecked.splice(currentIndex, 1);
                }

                setAllowTerms(newChecked);
            };

            const handleChangeRadio = (event) => {
                setRadioGroup(event.target.value);
            };

            useEffect(() => {
                if (allowTerms.length !== 3) {
                    setStatusTerms('failure');
                } else {
                    setStatusTerms('success');

                    const contains = ['aaaa', 'bbbb', 'ccc'];
                    dispatch(
                        setContractAllowed({
                            index: allowTerms,
                            contains: contains,
                        }),
                    );
                }
            }, [allowTerms]);

            useEffect(() => {
                if (statusTerms === 'success') {
                    if (
                        contractAllowed.index.length === 3 &&
                        contract.date.startDate &&
                        contract.date.endDate &&
                        positions.length > 0 &&
                        name
                    ) {
                        console.log('Success');
                        setStatusContract('success');
                    }
                }
            }, [statusTerms]);

            return (
                <div className={`register-contract terms ${statusTerms}`}>
                    <Tippy content="sdsdsd">
                        <h5>Xác nhận yêu cầu hợp đồng (*)</h5>
                    </Tippy>

                    <form id="form-register-terms">
                        <div className="check-box-selection">
                            <div>
                                <Checkbox
                                    title="jhg"
                                    color="success"
                                    checked={allowTerms.indexOf(1) !== -1}
                                    onClick={handleToggle(1)}
                                />
                                <span style={{ fontSize: '13px' }}>
                                    Đăng ký bài thi
                                    <Tippy content="@@@@">
                                        <span style={{ fontSize: '11px' }}>
                                            {' '}
                                            (*)
                                        </span>
                                    </Tippy>
                                </span>
                                <Collapse
                                    in={allowTerms.indexOf(1) !== -1}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <FormControl
                                        style={{
                                            paddingLeft: 50,
                                        }}
                                    >
                                        <FormLabel id="demo-row-radio-buttons-group-label">
                                            Hình thức
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={radioGroup}
                                            onChange={handleChangeRadio}
                                        >
                                            <FormControlLabel
                                                value="just"
                                                control={<Radio />}
                                                label="Cập nhật sau khi ký hợp đồng thành công"
                                            />
                                            <FormControlLabel
                                                value="lazy"
                                                control={<Radio />}
                                                label="Cập nhật trước 2/3 khóa học tương ứng"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Collapse>
                            </div>
                            <div>
                                <Checkbox
                                    title="jhgf"
                                    color="success"
                                    checked={allowTerms.indexOf(2) !== -1}
                                    onClick={handleToggle(2)}
                                />
                                <span style={{ fontSize: '13px' }}>
                                    Theo dõi hợp đồng
                                    <Tippy content="ppp">
                                        <span style={{ fontSize: '11px' }}>
                                            {' '}
                                            (*)
                                        </span>
                                    </Tippy>
                                </span>
                                <Collapse
                                    in={allowTerms.indexOf(2) !== -1}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>
                                                Ngày kết thúc hợp đồng
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Ngày kết thúc hợp đồng cần được
                                                xác nhận lại để phù hợp với quy
                                                trình tuyển dụng của trung tâm,
                                                luôn theo dõi để hợp đồng được
                                                ký kết.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header"
                                        >
                                            <Typography>
                                                Các điều khoản hợp đồng
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                Các điều khoản của hợp đồng sẽ
                                                phụ thuộc vào trung tâm, cần đọc
                                                kỹ và xem xét để tiến hành ký
                                                kết.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Collapse>
                            </div>
                            <div>
                                <Checkbox
                                    title="jhgf"
                                    color="success"
                                    checked={allowTerms.indexOf(3) !== -1}
                                    onClick={handleToggle(3)}
                                />
                                <span style={{ fontSize: '13px' }}>
                                    Theo dõi ứng viên
                                    <Tippy content="oo">
                                        <span style={{ fontSize: '11px' }}>
                                            {' '}
                                            (*)
                                        </span>
                                    </Tippy>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }

        useEffect(() => {
            if (!allowTime) {
                timeRowRef.current = [];
            }
        }, [allowTime]);

        return (
            <>
                <div className={`register-contract time ${statusEndDate}`}>
                    <h5>Xác nhận thời hạn hợp đồng</h5>

                    <Tippy content="Loi" visible={!endDate}>
                        <DatePicker
                            ref={dateEndEditRef}
                            label="Ngày kết thúc"
                            inputFormat="dd/MM/yyyy"
                            disabled={allowTime}
                            value={dayjs(endDate)}
                            onChange={handleEndDateChange}
                            textField={(params) => (
                                <TextField
                                    {...params}
                                    error={!endDate}
                                    helperText={
                                        !endDate ? 'Thông báo lỗi ở đây' : ''
                                    }
                                />
                            )}
                            slotProps={{
                                field: {
                                    clearable: true,
                                    onClear: () => setCleared(true),
                                },
                            }}
                            minDate={tomorrow}
                            sx={{ width: '60%' }}
                        />
                    </Tippy>

                    <form id="form-register-time">
                        <div className="check-box-selection">
                            <div>
                                <Checkbox
                                    title="Tự động cập nhật theo khóa học"
                                    color="success"
                                    onChange={(e, value) => setAllowTime(value)}
                                    value={allowTime}
                                />
                                <span style={{ fontSize: '13px' }}>
                                    Theo thời gian của các khóa học
                                    <Tippy content="Theo khoa hoc nha">
                                        <span> (*)</span>
                                    </Tippy>
                                </span>
                                <Collapse
                                    in={allowTime}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <TableContainer component={Paper}>
                                        <Table aria-label="collapsible table">
                                            {positionsR.length === 0 ? (
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="center">
                                                            Chọn ví trí tuyển
                                                            dụng
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ) : (
                                                <>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell />
                                                            <TableCell>
                                                                Tên vị trí
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                Số lượng
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {positionsR.map(
                                                            (row, i) => (
                                                                <Row
                                                                    ref={
                                                                        testRef
                                                                    }
                                                                    key={
                                                                        row
                                                                            .position
                                                                            ?.positionId ??
                                                                        i
                                                                    }
                                                                    row={row}
                                                                />
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </>
                                            )}
                                            {positionsR.length !== 0 ? (
                                                <caption>
                                                    <Button
                                                        style={{
                                                            float: 'right',
                                                        }}
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() =>
                                                            handleTimeSubmit({
                                                                action: true,
                                                            })
                                                        }
                                                    >
                                                        Xác nhận
                                                    </Button>
                                                </caption>
                                            ) : (
                                                <></>
                                            )}
                                        </Table>
                                    </TableContainer>
                                </Collapse>
                            </div>
                            <div>
                                <Checkbox
                                    title="Tự động ứng cử những ứng viên đủ điều kiện"
                                    color="success"
                                    onChange={(e, value) =>
                                        dispatch(setOldApplicantsAllowed(value))
                                    }
                                    checked={oldApplicantsAllowed}
                                />
                                <span style={{ fontSize: '13px' }}>
                                    Chấp nhận các ứng viên đã học
                                    <Tippy content="Theo khoa hoc nha">
                                        <span> (*)</span>
                                    </Tippy>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ///////////////////////////// */}
                <ContractTerm />
                {/* ///////////////////////////// */}
            </>
        );
    }

    const [cleared, setCleared] = useState(false);
    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => {};
    }, [cleared]);

    const dateEndEditRef = useRef(null);

    useEffect(() => {
        if (endDate === null) {
            dateEndEditRef.current.focus();
            setStatusEndDate('failure');
        } else {
            setStatusEndDate('success');
        }

        dispatch(setEndDate(dayjs(endDate)));
    }, [dispatch, endDate]);

    const testRef = useRef();

    return (
        <div className="registration-page">
            <Toaster duration={3000} position="top-right" richColors />

            <h1>ĐĂNG KÝ HỢP ĐỒNG TUYỂN DỤNG</h1>

            <div className="registration-container">
                <div className="registration-edit">
                    <h2>ĐĂNG KÝ HỢP ĐỒNG</h2>

                    <ContractDetails />
                    <Contract />
                </div>

                <ReviewContract />
            </div>
        </div>
    );
};

export default Registration;
