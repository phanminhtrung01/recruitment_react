import {
    Fragment,
    useState,
    useMemo,
    memo,
    useRef,
    useEffect,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { styled } from '@mui/system';

import {
    useTheme,
    TextField,
    // Chip,
    Collapse,
    // Button,
    AppBar,
    Tabs,
    Tab,
    Typography,

    // Box,
    // Grid,
    // Typography,
    Autocomplete,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    InputAdornment,
    Select,
    MenuItem,
    Divider,
    Button,
    Stack,
    Snackbar,
    InputLabel,
    IconButton,
} from '@mui/material';

import {
    DataGrid,
    GridToolbar,
    GridOverlay,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridRowModes,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridLogicOperator,
} from '@mui/x-data-grid';

import MuiAlert from '@mui/material/Alert';

import Icon from '@mui/material/Icon';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircularProgress from '@mui/material/CircularProgress';

import dayjs from 'dayjs';

import Tippy from '@tippyjs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useDebounce } from 'use-debounce';

import { IMaskInput } from 'react-imask';

import { NumericFormat } from 'react-number-format';

import './style.scss';
import { Email, RefreshOutlined } from '@mui/icons-material';
import {
    getContractDetailsByContractWithAmount,
    authInfoApi,
    contractsApi,
    positionsByContractApi,
} from '../../../api/auth';
import { useDispatch, useSelector } from 'react-redux';

import useRequestAuth from '../../../hooks/useRequestAuth';
import {
    updatePositions,
    updateContract,
    updateData,
    updateNameJob,
    updateDateExpire,
    updateGender,
    updateAge,
    updateWorkAddress,
    updateSalary,
    updateDescription,
    updateRequired,
    updateContactJobDTO,
    updateBenchmarkJobDTO,
    resetPostApply,
    changeAmountByContractDetailsId,
    updateBenefit,
    updateIsMerge,
} from '../../../redux/postApplySlice';

import { updateAll } from '../../../redux/infoUserSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import checkObjectUndefined from '../../../hooks/useObjectUndefined';
import { Toaster, toast } from 'sonner';
import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { useNavigate } from 'react-router-dom';
function Post() {
    const requestAuth = useRequestAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const today = dayjs();
    const tomorrow = today.add(1, 'day');

    const [contract, setContract] = useState(null);
    const followAddressRef = useRef(false);
    const followTimeRef = useRef(false);
    const salaryMinRef = useRef({
        name: 'min',
        value: 5000000,
    });
    const salaryMaxRef = useRef({
        name: 'max',
        value: 10000000,
    });
    const radioGenderRef = useRef('both');
    const fromAgeRef = useRef(18);
    const toAgeRef = useRef(22);

    const phoneRef = useRef('');
    const emailRef = useRef('');

    const minMarkRef = useRef(7);
    const maxMarkRef = useRef(10);
    const jobsWorkedRef = useRef([]);

    const textEditerJobDescriptionRef = useRef('');
    const textEditerJobRequirementsRef = useRef('');
    const textEditerJobBenefitsRef = useRef('');
    const [contractsData, setContractsData] = useState([]);
    const [jobsData, setJobsData] = useState([]);

    const [radioGroupRegister, setRadioGroupRegister] = useState('single');

    const handleSubmit = async (postApply, e) => {
        e.preventDefault();

        const { data, positions, isMerge } = postApply;
        const dataRequest = [];
        positions.forEach((pos) => {
            const { amount, contractDetailsId } = pos;
            const {
                nameJob,
                datePost,
                dateExpire,
                submitted,
                viewed,
                salary,
                workAddress,
                benefit,
                description,
                required,
                age,
                gender,
                contactJobDTO,
                benchmarkJobDTO,
            } = data;

            const dataFormat = {
                nameJob: nameJob,
                datePost: datePost,
                dateExpire: dateExpire,
                submitted: submitted,
                viewed: viewed,
                salary: salary,
                workAddress: workAddress,
                benefit: benefit,
                description: description,
                required: required,
                age: age,
                gender: gender,
                contactJobDTO: contactJobDTO,
                benchmarkJobDTO: benchmarkJobDTO,
                recordId: contractDetailsId,
                amount: amount,
                isMerge: isMerge,
            };

            dataRequest.push(dataFormat);
        });

        console.log(dataRequest);

        const responsePromise = requestAuth.post(
            '/post-apply/create_merge',
            JSON.stringify(dataRequest),
        );

        const idToats = toast.promise(responsePromise, {
            loading: 'Đang kiểm tra ...',
            success: (data) => {
                setTimeout(() => {
                    navigate('../posts', { replace: true });
                }, 2500);
                return NotifierSnackbar({
                    title: 'Thành công ',
                    sub1: 'Đăng ký tin tuyển dụng thành công!',
                    sub2: 'Chú ý trạng thái hợp đồng để tuyển dụng',
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
                    sub1: 'Đăng ký tin tuyển dụng không thành công!',
                    sub2: message,
                    toast: toast,
                    idToats: idToats,
                    type: 'error',
                });
            },
        });
    };

    const handleChangeRadioRegister = (event) => {
        setRadioGroupRegister(event.target.value);
    };

    function RecruitmentTabs({ ...props }) {
        const maskRef = useRef();

        const StyledTab = useMemo(() => {
            return styled(Tab)({
                minHeight: '30px',
                height: '30px',
                marginRight: '10px',
                color: '#0400b0',
                backgroundColor: '#5454694c',
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                borderBottom: '20px',
                opacity: 1,

                '&.Mui-selected': {
                    color: '#000000',
                    backgroundColor: '#f9f8b6',
                    borderTop: '1px solid #e0e0fd',
                    borderLeft: '1px solid #e0e0fd',
                    borderRight: '1px solid #e0e0fd',
                },
            });
        }, []);

        function TabPanel(props) {
            const { children, value, index, ...other } = props;

            return <div {...other}>{children}</div>;
        }

        TabPanel.propTypes = {
            children: PropTypes.node,
            index: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired,
        };

        const TextMaskCustom = forwardRef((props, ref) => {
            const { onChange, ...other } = props;

            return (
                <IMaskInput
                    {...other}
                    mask="(000) 0000 000"
                    definitions={{
                        '#': /[1-9]/,
                    }}
                    inputRef={ref}
                    onAccept={(value) => {
                        console.log(value);
                        onChange({
                            target: { name: props.name, value },
                        });
                    }}
                    ref={maskRef}
                    overwrite
                />
            );
        });

        TextMaskCustom.propTypes = {
            name: PropTypes.string.isRequired,
            onChange: PropTypes.func.isRequired,
        };

        console.log('RecruitmentTabs', 11);

        function InfoRecruitmentTabPanel() {
            const { nameJob } = useSelector(
                (state) => state.postApply.value.data,
            );

            const { info } = useSelector((state) => state.infoUser.value);
            const postApply = useSelector((state) => state.postApply.value);
            const { data } = postApply;
            const { dateExpire } = data;

            const [filterLevel, setFilterLevel] = useState('');
            const [endDate, setEndDateJob] = useState(dateExpire);
            const [province, setProvince] = useState(null);
            const [district, setDistrict] = useState(null);
            const [ward, setWard] = useState(null);
            const [address, setAddress] = useState(info?.address);

            const toolbarOptions = useMemo(() => {
                return [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],

                    [{ header: 1 }, { header: 2 }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    [{ direction: 'rtl' }],

                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],

                    ['link', 'image'],

                    ['clean'],
                ];
            }, []);

            const [currency, setCurrency] = useState('vnd');
            const [isChangeCurrency, setIsChangeCurrency] = useState(false);

            const [fromAge, setFromAge] = useState(fromAgeRef.current);
            const [toAge, setToAge] = useState(toAgeRef.current);

            const [followAddress, setFollowAddress] = useState(
                followAddressRef.current,
            );

            const [followTime, setFollowTime] = useState(followTimeRef.current);

            const [radioGroupGender, setRadioGroupGender] = useState(
                radioGenderRef.current,
            );

            const updateMinSalaryRef = useRef();
            const updateMaxSalaryRef = useRef();

            const handleChangeFilterLevel = (event) => {
                setFilterLevel(event.target.value);
            };

            const handleCheckFollowAddress = () => {
                setFollowAddress(!followAddress);
            };
            const handleCheckFollowTime = () => {
                setFollowTime(!followTime);
            };

            const handleChangeRadioGender = (event) => {
                setRadioGroupGender(event.target.value);
            };

            // const handleChangeMinSalary = (event) => {
            //     setMinSalary(event.target.value);
            // };

            // const handleChangeMaxSalary = (event) => {
            //     setMaxSalary(event.target.value);
            // };

            const handleFromAgeChange = (event) => {
                setFromAge(event.target.value);
            };

            const handleToAgeChange = (event) => {
                setToAge(event.target.value);
            };

            const handleEndDateChange = (newValue) => {
                setEndDateJob(newValue);
            };

            const [jobDescription, setJobDescription] = useState(
                textEditerJobDescriptionRef.current,
            );

            const [jobRequirements, setJobRequirements] = useState(
                textEditerJobRequirementsRef.current,
            );
            const [jobBenefits, setJobBenefits] = useState(
                textEditerJobBenefitsRef.current,
            );

            function ProvinceSelectLazy({ delay, props }) {
                const [open, setOpen] = useState(false);
                const [options, setOptions] = useState([]);
                const [inputProvince, setInputProvince] = useState('');
                const [fetching, setFetching] = useState(false);
                const [value] = useDebounce(inputProvince, delay);

                useEffect(() => {
                    (async () => {
                        if (value.length !== 0) {
                            setFetching(true);
                            const response = await fetch(
                                `https://provinces.open-api.vn/api/p/search/?q=${value}`,
                            );
                            const provinces = await response.json();

                            console.log('valueInput:', provinces);
                            setOptions(
                                provinces.map((provincePar) => {
                                    const province = {
                                        name: provincePar.name,
                                        code: provincePar.code,
                                    };
                                    return province;
                                }),
                            );
                            setFetching(false);
                        }
                    })();
                }, [value]);

                useEffect(() => {
                    if (!open) {
                        setOptions([]);
                    }
                }, [open]);

                return (
                    <Autocomplete
                        {...props}
                        id="province-select-lazy"
                        sx={{
                            m: 1,
                        }}
                        open={open}
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
                        includeInputInList
                        filterSelectedOptions
                        value={province}
                        noOptionsText="Không có tỉnh/thành phố phù hợp"
                        onChange={(event, newValue) => {
                            setOptions(
                                newValue ? [newValue, ...options] : options,
                            );
                            setProvince(newValue);
                            setFetching(false);
                        }}
                        onInputChange={(event, newInputValue) => {
                            setInputProvince(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn tỉnh/thành phố"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <Fragment>
                                            {fetching ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            ) : null}
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
            }

            function DistrictSelect() {
                const [open, setOpen] = useState(false);
                const [options, setOptions] = useState([]);
                const [fetching, setFetching] = useState(false);

                useMemo(() => {
                    let active = true;

                    (async () => {
                        if (active && province) {
                            setFetching(true);
                            const response = await fetch(
                                `https://provinces.open-api.vn/api/p/${province.code}?depth=2`,
                            );
                            const provinces = await response.json();

                            setOptions(
                                provinces.districts.map((district) => {
                                    const newDistrict = {
                                        name: district.name,
                                        code: district.code,
                                    };
                                    return newDistrict;
                                }),
                            );
                            setFetching(false);
                        }
                    })();

                    return () => {
                        active = false;
                    };
                }, []);

                useEffect(() => {
                    if (!open) {
                        setOptions([]);
                    }
                }, [open]);

                useEffect(() => {
                    console.log('d:', options);
                }, [options]);

                return (
                    <Autocomplete
                        id="district-select-lazy"
                        disabled={!province}
                        sx={{
                            m: 1,
                        }}
                        open={open}
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
                        value={district}
                        noOptionsText="Không có quận/huyện phù hợp"
                        onChange={(event, newValue) => {
                            setOptions(
                                newValue ? [newValue, ...options] : options,
                            );
                            setDistrict(newValue);
                            setFetching(false);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn quận/huyện"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <Fragment>
                                            {fetching ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            ) : null}
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
            }

            function WardSelect() {
                const [open, setOpen] = useState(false);
                const [options, setOptions] = useState([]);
                const [fetching, setFetching] = useState(false);

                useMemo(() => {
                    let active = true;

                    (async () => {
                        if (active && district) {
                            setFetching(true);
                            const response = await fetch(
                                `https://provinces.open-api.vn/api/d/${district.code}?depth=2`,
                            );
                            const districts = await response.json();

                            setOptions(
                                districts.wards.map((ward) => {
                                    const newWard = {
                                        name: ward.name,
                                        code: ward.code,
                                    };
                                    return newWard;
                                }),
                            );
                            setFetching(false);
                        }
                    })();

                    return () => {
                        active = false;
                    };
                }, []);

                useEffect(() => {
                    if (!open) {
                        setOptions([]);
                    }
                }, [open]);

                useEffect(() => {
                    console.log('w:', options);
                }, [options]);

                return (
                    <Autocomplete
                        id="ward-select-lazy"
                        disabled={!district}
                        sx={{
                            m: 1,
                        }}
                        open={open}
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
                        value={ward}
                        noOptionsText="Không có quận/huyện phù hợp"
                        onChange={(event, newValue) => {
                            setOptions(
                                newValue ? [newValue, ...options] : options,
                            );
                            setWard(newValue);
                            setFetching(false);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn phường/xã"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <Fragment>
                                            {fetching ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            ) : null}
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
            }

            const NumericFormatCustom = forwardRef((props, ref) => {
                const { onChange, ...other } = props;

                return (
                    <NumericFormat
                        {...other}
                        getInputRef={ref}
                        onValueChange={(values) => {
                            onChange({
                                target: {
                                    name: props.name,
                                    value: values.value,
                                },
                            });
                        }}
                        thousandSeparator
                        valueIsNumericString
                    />
                );
            });

            NumericFormatCustom.propTypes = {
                name: PropTypes.string.isRequired,
                onChange: PropTypes.func.isRequired,
            };

            const InputDecorators = forwardRef(
                ({ salaryRef, ...props }, ref) => {
                    const [salary, setSalary] = useState(
                        salaryRef.current.value,
                    );

                    const StyledSelect = useMemo(() => {
                        return styled(Select)({
                            '&.MuiOutlinedInput-root': {
                                position: 'inherit',
                            },
                        });
                    }, []);

                    const StyledIcon = useMemo(() => {
                        return styled(Icon)({
                            'MuiIcon-root': {
                                overflow: 'visible',
                            },
                        });
                    }, []);

                    const handleChangeSalary = (event) => {
                        setSalary(event.target.value);
                    };

                    useEffect(() => {
                        salaryRef.current.value = salary;
                        if (salaryRef.current.name === 'min') {
                        }

                        if (salaryRef.current.name === 'max') {
                        }
                    }, [salary, salaryRef]);

                    useImperativeHandle(ref, () => ({
                        updateSalary(currency) {
                            if (
                                currency === 'dollar' &&
                                isChangeCurrency &&
                                salary
                            ) {
                                setSalary(parseInt(salary) / 23000);
                            } else if (
                                currency === 'vnd' &&
                                isChangeCurrency &&
                                salary
                            ) {
                                setSalary(parseInt(salary) * 23000);
                            }
                        },
                        getSalary() {
                            return salary;
                        },
                    }));

                    return (
                        <Tippy
                            placement="auto-start"
                            content="Chuyển đổi ngôn ngữ nhập US (United States)"
                        >
                            <TextField
                                {...props}
                                value={salary}
                                onChange={handleChangeSalary}
                                variant="outlined"
                                sx={{ width: 300 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <div
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <StyledIcon
                                                    sx={{
                                                        overflow: 'visible',
                                                    }}
                                                    fontSize="small"
                                                >
                                                    {
                                                        {
                                                            vnd: '฿',
                                                            dollar: '$',
                                                        }[currency]
                                                    }
                                                </StyledIcon>
                                            </div>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <StyledSelect
                                                value={currency}
                                                onChange={(event) => {
                                                    setCurrency(
                                                        event.target.value,
                                                    );
                                                    setIsChangeCurrency(true);
                                                }}
                                            >
                                                <MenuItem value="vnd">
                                                    VN vnd
                                                </MenuItem>
                                                <MenuItem value="dollar">
                                                    US dollar
                                                </MenuItem>
                                            </StyledSelect>
                                        </InputAdornment>
                                    ),
                                    inputComponent: NumericFormatCustom,
                                }}
                                name="numberformat"
                            />
                        </Tippy>
                    );
                },
            );

            useEffect(() => {
                const names = nameJob?.split(',');
                const onlyNames = names.map((name) =>
                    name.split('-')[1]
                        ? name.split('-')[1]
                        : name.split('-')[0],
                );
                console.log(onlyNames);
                let nameLevel;
                if (filterLevel === 'intern') {
                    nameLevel = 'Thực tập sinh';
                }
                if (filterLevel === 'junior') {
                    nameLevel = 'Kỹ sư';
                }
                if (filterLevel === 'middle') {
                    nameLevel = 'Lập trình viên';
                }
                if (filterLevel === 'senior') {
                    nameLevel = 'Chuyên viên';
                }

                const newNames = onlyNames
                    .map((name) => `${nameLevel}-${name}`)
                    .join(', ');
                dispatch(updateNameJob(newNames));
            }, [filterLevel]);

            useEffect(() => {
                dispatch(updateNameJob(nameJob));
            }, [nameJob]);

            useEffect(() => {
                updateMinSalaryRef.current.updateSalary(currency);
                updateMaxSalaryRef.current.updateSalary(currency);
                // dispatch(
                //     updateSalary([
                //         updateMinSalaryRef.current,
                //         updateMaxSalaryRef.current,
                //     ]),
                // );
            }, [currency]);

            useEffect(() => {
                textEditerJobDescriptionRef.current = jobDescription;
                dispatch(updateDescription(jobDescription));
            }, [jobDescription]);

            useEffect(() => {
                textEditerJobRequirementsRef.current = jobRequirements;
                dispatch(updateRequired(jobRequirements));
            }, [jobRequirements]);

            useEffect(() => {
                textEditerJobBenefitsRef.current = jobBenefits;
                dispatch(updateBenefit(jobBenefits));
            }, [jobBenefits]);

            useEffect(() => {
                if (followAddress) {
                    setAddress(info?.address);
                    setProvince(null);
                }
                followAddressRef.current = followAddress;
            }, [followAddress]);

            useEffect(() => {
                if (followTime) {
                    setEndDateJob(dayjs(contract?.effectiveDate));
                }
                followTimeRef.current = followTime;
            }, [followTime]);

            useEffect(() => {
                dispatch(
                    updateDateExpire(
                        endDate
                            ? dayjs(endDate)?.format('DD/MM/YYYY')
                            : dayjs().add(1, 'day').format('DD/MM/YYYY'),
                    ),
                );
            }, [endDate]);

            useEffect(() => {
                radioGenderRef.current = radioGroupGender;

                const minSalary = updateMinSalaryRef.current.getSalary();
                const maxSalary = updateMaxSalaryRef.current.getSalary();
                dispatch(updateSalary([minSalary, maxSalary].join('-')));
                let nameGender;
                if (radioGroupGender === 'male') {
                    nameGender = 'Nam';
                }
                if (radioGroupGender === 'female') {
                    nameGender = 'Nữ';
                }
                if (radioGroupGender === 'both') {
                    nameGender = 'Nam/Nữ';
                }

                dispatch(updateGender(nameGender));
            }, [radioGroupGender]);

            useEffect(() => {
                fromAgeRef.current = fromAge;
                setToAge(+fromAge + 1);
            }, [fromAge]);

            useEffect(() => {
                toAgeRef.current = toAge;
            }, [toAge]);

            useEffect(() => {
                setDistrict(null);
            }, [province]);

            useEffect(() => {
                setWard(null);
            }, [district]);
            useEffect(() => {}, [ward]);

            useEffect(() => {
                if (ward && district && province) {
                    const addressArr = [
                        ward?.name,
                        district?.name,
                        province?.name,
                    ];
                    setAddress(addressArr.join(', '));
                }
            }, [ward, district, province]);

            useEffect(() => {
                dispatch(updateWorkAddress(address));
            }, [address]);

            useEffect(() => {
                dispatch(updateAge([fromAge, toAge].join('-')));
            }, [fromAge, toAge]);

            return (
                <div
                    style={{
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    <h4
                        style={{
                            marginTop: '10px',
                            marginBottom: '10px',
                            width: '100%',
                            padding: '8px',
                            textTransform: 'uppercase',
                            backgroundColor: '#f0f3ba',
                        }}
                    >
                        Thông tin tuyển dụng
                    </h4>
                    <div
                        style={{
                            padding: '5px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                    >
                        <div
                            className="job-name"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 30,
                                width: '90%',
                            }}
                        >
                            <div
                                style={{
                                    flex: 2,
                                }}
                            >
                                <h5>Tên công việc tuyển dụng</h5>
                                <TextField
                                    disabled={true}
                                    label="Tên công việc"
                                    sx={{
                                        m: 1,
                                        width: 1,
                                    }}
                                    value={nameJob}
                                />
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                }}
                            >
                                <h5>Chức danh tuyển dụng</h5>
                                <FormControl sx={{ m: 1, width: 1 }}>
                                    <InputLabel id="demo-simple-select-label">
                                        Loại
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={filterLevel}
                                        label="level"
                                        onChange={handleChangeFilterLevel}
                                    >
                                        <MenuItem value={'intern'}>
                                            Thực tập sinh
                                        </MenuItem>
                                        <MenuItem value={'junior'}>
                                            Kỹ sư
                                        </MenuItem>
                                        <MenuItem value={'middle'}>
                                            Lập trình viên
                                        </MenuItem>
                                        <MenuItem value={'senior'}>
                                            Chuyên viên
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="job-description">
                            <h5>Mô tả công việc</h5>
                            <ReactQuill
                                theme="snow"
                                value={jobDescription}
                                onChange={setJobDescription}
                                placeholder="Nhập mô tả công việc tuyển dụng"
                                modules={{
                                    toolbar: toolbarOptions,
                                }}
                            />
                        </div>
                        <div className="job-requirements">
                            <h5>Yêu cầu công việc</h5>
                            <ReactQuill
                                theme="snow"
                                value={jobRequirements}
                                onChange={setJobRequirements}
                                placeholder="Nhập yêu cầu công việc tuyển dụng"
                                modules={{
                                    toolbar: toolbarOptions,
                                }}
                            />
                        </div>

                        <div className="job-requirements">
                            <h5>Quyền lợi</h5>
                            <ReactQuill
                                theme="snow"
                                value={jobBenefits}
                                onChange={setJobBenefits}
                                placeholder="Nhập yêu cầu công việc tuyển dụng"
                                modules={{
                                    toolbar: toolbarOptions,
                                }}
                            />
                        </div>

                        <div className="jobs-time">
                            <h5>Thời hạn bài đăng</h5>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContain: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContain: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Checkbox
                                        title="Tự động cập nhật theo thời hạn hợp đồng"
                                        color="success"
                                        checked={followTime}
                                        onChange={handleCheckFollowTime}
                                    />
                                    <span
                                        style={{
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Theo thời hạn hợp đồng
                                        <Tippy content="Theo khoa hoc nha">
                                            <span> (*)</span>
                                        </Tippy>
                                    </span>
                                </div>
                                <div
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: 20,
                                    }}
                                >
                                    <h6>Thời gian công việc</h6>
                                    <DatePicker
                                        disabled={followTime}
                                        label="Ngày"
                                        inputFormat="dd/MM/yyyy"
                                        value={dayjs(endDate)}
                                        onChange={handleEndDateChange}
                                        minDate={tomorrow}
                                        sx={{ m: 1, width: '60%' }}
                                        textField={(params) => (
                                            <TextField
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <Fragment>
                                                            {
                                                                params
                                                                    .InputProps
                                                                    .endAdornment
                                                            }
                                                            <IconButton
                                                                onClick={async () => {
                                                                    setEndDateJob(
                                                                        dayjs(
                                                                            contract?.effectiveDate,
                                                                        ),
                                                                    );
                                                                }}
                                                            >
                                                                <RefreshOutlined />
                                                            </IconButton>
                                                        </Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="jobs-address">
                            <h5>Địa điểm làm việc</h5>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContain: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContain: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Checkbox
                                        title="Tự động cập nhật theo địa chỉ công ty"
                                        color="success"
                                        checked={followAddress}
                                        onChange={() =>
                                            handleCheckFollowAddress()
                                        }
                                    />
                                    <span
                                        style={{
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Theo địa chỉ mặc định công ty
                                        <Tippy content="Theo khoa hoc nha">
                                            <span> (*)</span>
                                        </Tippy>
                                    </span>
                                </div>

                                <Collapse
                                    in={!followAddress}
                                    timeout="auto"
                                    sx={{ m: 1 }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '50px',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <h5>Tỉnh/Thành phố</h5>
                                            <ProvinceSelectLazy delay={1000} />
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <h5>Quận/Huyện</h5>
                                            <DistrictSelect />
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <h5>Phường/Xã</h5>
                                            <WardSelect />
                                        </div>
                                    </div>
                                </Collapse>

                                <div>
                                    <h5>Địa chỉ</h5>
                                    <TextField
                                        disabled={true}
                                        label="Địa chỉ làm việc"
                                        sx={{
                                            m: 1,
                                            width: '80%',
                                            maxWidth: '600px',
                                        }}
                                        value={address}
                                        InputProps={{
                                            endAdornment: (
                                                <Fragment>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        disabled={
                                                            info?.address ||
                                                            !followAddress
                                                        }
                                                        onClick={async () => {
                                                            const info =
                                                                await getInfo();
                                                            setAddress(
                                                                info.info
                                                                    .address,
                                                            );
                                                        }}
                                                    >
                                                        <RefreshOutlined />
                                                    </IconButton>
                                                </Fragment>
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="jobs-salary">
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    rowGap: '20px',
                                    columnGap: '100px',
                                }}
                            >
                                <div>
                                    <h5>Mức lương tối thiểu</h5>
                                    <InputDecorators
                                        ref={updateMinSalaryRef}
                                        salaryRef={salaryMinRef}
                                    />
                                </div>
                                <div>
                                    <h5>Mức lương tối đa</h5>
                                    <InputDecorators
                                        error={
                                            parseInt(
                                                salaryMinRef.current.value,
                                            ) >=
                                            parseInt(salaryMaxRef.current.value)
                                        }
                                        helperText={
                                            parseInt(
                                                salaryMinRef.current.value,
                                            ) >=
                                            parseInt(salaryMaxRef.current.value)
                                                ? 'Nhập lương lớn hơn'
                                                : ''
                                        }
                                        ref={updateMaxSalaryRef}
                                        salaryRef={salaryMaxRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4
                        style={{
                            marginTop: '10px',
                            marginBottom: '10px',
                            width: '100%',
                            padding: '8px',
                            textTransform: 'uppercase',
                            backgroundColor: '#f0f3ba',
                        }}
                    >
                        Yêu cầu chung
                    </h4>
                    <div
                        style={{
                            padding: '5px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                    >
                        <div className="job-gender">
                            <h5>Giới tính</h5>
                            <FormControl sx={{ m: 1 }}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={radioGroupGender}
                                    onChange={handleChangeRadioGender}
                                >
                                    <FormControlLabel
                                        value="both"
                                        control={<Radio />}
                                        label="Nam/Nữ"
                                    />
                                    <FormControlLabel
                                        value="male"
                                        control={<Radio />}
                                        label="Nam"
                                    />
                                    <FormControlLabel
                                        value="female"
                                        control={<Radio />}
                                        label="Nữ"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="job-age">
                            <h5>Tuổi</h5>
                            <TextField
                                label="Từ"
                                type="number"
                                sx={{
                                    m: 1,
                                    width: '30%',
                                }}
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                    pattern: '\\d+',
                                    onInput: function (e) {
                                        e.target.value = Math.max(
                                            0,
                                            parseInt(e.target.value),
                                        )
                                            .toString()
                                            .replace(/[^0-9]/g, '');
                                    },
                                }}
                                value={fromAge}
                                onChange={handleFromAgeChange}
                            />
                            <TextField
                                error={parseInt(fromAge) >= parseInt(toAge)}
                                helperText={
                                    parseInt(fromAge) >= parseInt(toAge)
                                        ? 'Nhập độ tuổi lớn hơn'
                                        : ''
                                }
                                label="Đến"
                                type="number"
                                sx={{
                                    m: 1,
                                    width: '30%',
                                }}
                                value={toAge}
                                onChange={handleToAgeChange}
                                inputProps={{
                                    min: 1,
                                    step: 1,
                                    pattern: '\\d+',
                                    onInput: function (e) {
                                        e.target.value = Math.max(
                                            0,
                                            parseInt(e.target.value),
                                        )
                                            .toString()
                                            .replace(/[^0-9]/g, '');
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button
                            sx={{ width: '10%', fontSize: '1.2rem' }}
                            variant="contained"
                            color="success"
                            onClick={() => handleChangeIndex(1)}
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </div>
            );
        }

        function ContactInfoTabPanel() {
            const postApply = useSelector((state) => state.postApply.value);
            const [phone, setPhone] = useState(phoneRef.current);
            const [email, setEmail] = useState(emailRef.current);

            const handlePhoneChange = (event) => {
                setPhone(event.target.value);
            };
            const handleEmailChange = (event) => {
                setEmail(event.target.value);
            };

            function validatedEmail(email) {
                const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                if (!re.test(email)) {
                    return true;
                } else {
                    return false;
                }
            }

            useEffect(() => {
                phoneRef.current = phone;
            }, [phone]);

            useEffect(() => {
                emailRef.current = email;
            }, [email]);

            useEffect(() => {
                dispatch(
                    updateContactJobDTO({
                        email: email,
                        phoneNumber: maskRef.current.maskRef.unmaskedValue,
                    }),
                );
            }, [email, phone]);

            return (
                <>
                    <div
                        style={{
                            width: '100%',
                        }}
                    >
                        <h4
                            style={{
                                marginTop: '10px',
                                marginBottom: '10px',
                                width: '100%',
                                padding: '8px',
                                textTransform: 'uppercase',
                                backgroundColor: '#f0f3ba',
                            }}
                        >
                            Thông tin liên hệ
                        </h4>
                        <div
                            style={{
                                padding: '5px',
                                display: 'flex',
                                gap: '50px',
                                width: '100%',
                            }}
                        >
                            <div className="contact-email">
                                <h5>Email</h5>
                                <TextField
                                    sx={{ m: 1, width: '300px' }}
                                    style={{
                                        flex: 2,
                                    }}
                                    label="Nhập email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={
                                        validatedEmail(email) &&
                                        email.length !== 0
                                    }
                                    helperText={
                                        validatedEmail(email) &&
                                        email.length !== 0
                                            ? 'Email không hợp lệ'
                                            : ''
                                    }
                                />
                            </div>
                            <div className="contact-phone">
                                <h5>Số điện thoại</h5>
                                <TextField
                                    sx={{ m: 1, width: '300px' }}
                                    style={{
                                        flex: 1,
                                    }}
                                    label="Nhập số điện thoại"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    InputProps={{
                                        inputComponent: TextMaskCustom,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button
                            sx={{ width: '10%', fontSize: '1.2rem' }}
                            variant="contained"
                            color="success"
                            disabled={checkObjectUndefined(
                                postApply.data.contactJobDTO,
                            )}
                            onClick={() => handleChangeIndex(2)}
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </>
            );
        }

        function CandidateEvaluationTabPanel() {
            const postApply = useSelector((state) => state.postApply.value);
            const [minMark, setMinMark] = useState(minMarkRef.current);
            const [maxMark, setMaxMark] = useState(maxMarkRef.current);
            const [selectedJobsWorked, setSelectedJobsWorked] = useState(
                jobsWorkedRef.current,
            );

            const handleMinMarkChange = (event) => {
                setMinMark(event.target.value);
            };

            const handleMaxMarkChange = (event) => {
                setMaxMark(event.target.value);
            };

            const handleJobsWorkedChange = (event, newValue) => {
                setSelectedJobsWorked(newValue);
            };

            useEffect(() => {
                minMarkRef.current = minMark;
                setMaxMark(+minMark + 1);
            }, [minMark]);

            useEffect(() => {
                maxMarkRef.current = maxMark;
            }, [maxMark]);

            useEffect(() => {
                dispatch(
                    updateBenchmarkJobDTO({
                        minMark: +minMark,
                        maxMark: +maxMark,
                    }),
                );
            }, [minMark, maxMark]);

            useEffect(() => {
                jobsWorkedRef.current = selectedJobsWorked;
            }, [selectedJobsWorked]);

            return (
                <>
                    <div
                        style={{
                            width: '100%',
                        }}
                    >
                        <h4
                            style={{
                                marginTop: '10px',
                                marginBottom: '10px',
                                width: '100%',
                                padding: '8px',
                                textTransform: 'uppercase',
                                backgroundColor: '#f0f3ba',
                            }}
                        >
                            Độ phù hợp ứng viên
                        </h4>

                        <div
                            className=""
                            style={{
                                padding: '5px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }}
                        >
                            <div
                                className="job-mark"
                                style={{
                                    padding: '5px',
                                }}
                            >
                                <h5>Điểm</h5>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '20px',
                                    }}
                                >
                                    <TextField
                                        label="Từ"
                                        type="number"
                                        sx={{
                                            m: 1,
                                            width: '20%',
                                        }}
                                        inputProps={{
                                            min: 0,
                                            step: 1,
                                            max: 10,
                                            pattern: '\\d+',
                                            onInput: function (e) {
                                                let value = parseInt(
                                                    e.target.value,
                                                );
                                                if (value < 0) value = 0;
                                                if (value > 10) value = 10;
                                                e.target.value = value
                                                    .toString()
                                                    .replace(/[^0-9]/g, '');
                                            },
                                        }}
                                        value={minMark}
                                        onChange={handleMinMarkChange}
                                    />
                                    <TextField
                                        error={+minMark >= +maxMark}
                                        helperText={
                                            +minMark >= +maxMark
                                                ? 'Nhập điểm lớn hơn'
                                                : ''
                                        }
                                        label="Đến"
                                        type="number"
                                        sx={{
                                            m: 1,
                                            width: '20%',
                                        }}
                                        inputProps={{
                                            min: 0,
                                            step: 1,
                                            max: 10,
                                            pattern: '\\d+',
                                            onInput: function (e) {
                                                let value = parseInt(
                                                    e.target.value,
                                                );
                                                value = Math.min(value, 10); // Giới hạn giá trị tối đa là 10
                                                e.target.value = value
                                                    .toString()
                                                    .replace(/[^0-9]/g, '');
                                            },
                                        }}
                                        value={maxMark}
                                        onChange={handleMaxMarkChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            padding: '15px',
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button
                            disabled={checkObjectUndefined(postApply, [
                                'viewed',
                                'submitted',
                            ])}
                            sx={{ width: '10%', fontSize: '1.2rem' }}
                            variant="contained"
                            color="success"
                            onClick={async (e) =>
                                await handleSubmit(postApply, e)
                            }
                            onDoubleClick={() => {}}
                        >
                            Tạo bài đăng
                        </Button>
                    </div>
                </>
            );
        }

        const theme = useTheme();
        const [valuePanal, setValuePanal] = useState(0);

        const handleChange = (event, newValue) => {
            setValuePanal(newValue);
        };

        const handleChangeIndex = (index) => {
            setValuePanal(index);
        };

        return (
            <div {...props}>
                <div
                    style={{
                        position: 'sticky',
                        top: 180,
                        zIndex: 100,
                        backgroundColor: '#faffb7',
                    }}
                >
                    <AppBar
                        style={{
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                        }}
                        position="static"
                    >
                        <Tabs
                            style={{
                                minHeight: '30px',
                                height: '30px',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                            }}
                            value={valuePanal}
                            onChange={handleChange}
                            TabIndicatorProps={{
                                style: {
                                    height: '0px',
                                },
                            }}
                            textColor="inherit"
                            aria-label="full width tabs example"
                        >
                            <StyledTab label="Thông Tin Tuyển Dụng" />
                            <StyledTab label="Thông Tin Liên Hệ" />
                            <StyledTab label="Thông Tin Điểm Ứng Viên" />
                        </Tabs>
                    </AppBar>
                </div>
                <SwipeableViews
                    animateHeight
                    style={{
                        border: '1px solid #e0e0fd',
                    }}
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={valuePanal}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel
                        value={valuePanal}
                        index={0}
                        dir={theme.direction}
                    >
                        <InfoRecruitmentTabPanel />
                    </TabPanel>
                    <TabPanel
                        value={valuePanal}
                        index={1}
                        dir={theme.direction}
                    >
                        <ContactInfoTabPanel />
                    </TabPanel>
                    <TabPanel
                        value={valuePanal}
                        index={2}
                        dir={theme.direction}
                    >
                        <CandidateEvaluationTabPanel />
                    </TabPanel>
                </SwipeableViews>
            </div>
        );
    }

    const handleContractChange = (event, newValue) => {
        setContract(newValue);
    };

    const [selectedJobs, setSelectedJobs] = useState([]);

    const handleJobsChange = (event, newValue) => {
        setSelectedJobs(newValue);
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const getContracts = async () => {
        try {
            const response = await contractsApi(requestAuth);

            const status = response.status;
            if (status === 200) {
                const data = response.data;
                setContractsData(data);
            }
        } catch (e) {
            console.log('CONTRACTS_ERROR');
        }
    };

    const getInfo = async () => {
        const response = await authInfoApi(requestAuth);

        if (response?.status === 200) {
            dispatch(updateAll(response.data));

            return response.data;
        }
    };

    const DataContractDetails = () => {
        const [rows, setRows] = useState([]);

        const handleEditCellTextChange = (p, e) => {
            p.api.setEditCellValue({
                ...p,
                value: e.target.value,
            });

            dispatch(
                changeAmountByContractDetailsId({
                    contractDetailsId: p.row.id,
                    amount: e.target.value,
                }),
            );
        };

        const TextFieldNoneBoderStyle = styled(TextField)({
            '& .MuiTextField-root': {
                border: 'none',
                width: '100%',
            },
            fieldset: {
                border: 'none',
            },
            // '& .MuiInputBase-root:before': {
            //     borderBottom: 'none',
            // },
        });

        const columns = [
            {
                field: 'name',
                headerName: 'Tên vị trí tuyển dụng',
                flex: 1,
            },
            {
                field: 'amountEdit',
                headerName: 'Số lượng tuyển',
                flex: 1,
                editable: true,
                renderEditCell: (params) => (
                    <TextFieldNoneBoderStyle
                        value={params.value}
                        onChange={(event) =>
                            handleEditCellTextChange(params, event)
                        }
                        placeholder="Nhập số lượng cần tuyển"
                        // error={+minMark >= +maxMark}
                        // helperText={
                        //     +minMark >= +maxMark ? 'Nhập điểm lớn hơn' : ''
                        // }
                        type="number"
                        inputProps={{
                            min: 1,
                            step: 1,
                            max: params.row.amount,
                            pattern: '\\d+',
                            onInput: function (e) {
                                let value = parseInt(e.target.value);
                                value = Math.min(value, params.row.amount);
                                e.target.value = value
                                    .toString()
                                    .replace(/[^0-9]/g, '');
                            },
                        }}
                    />
                ),
            },
            {
                field: 'amount',
                headerName: 'Số lượng còn lại',
                flex: 1,
            },
        ];

        useEffect(() => {
            let dataRow = [];
            jobsData.forEach((jobData) => {
                const { contractDetailsId, position, amount } = jobData;
                const data = {
                    id: contractDetailsId,
                    name: position.name,
                    amount: amount,
                    amountEdit: 1,
                };

                dataRow.push(data);
            });

            setRows(dataRow);
        }, []);

        return (
            <DataGrid
                sx={{
                    m: 1,
                }}
                autoHeight
                rows={rows}
                getRowId={(row) => row.id}
                columns={columns}
                editMode="cell"
                pageSize={rows.length}
                hideFooter={true}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                columnVisibilityModel={{
                    id: false,
                }}
            />
        );
    };

    useEffect(() => {
        getInfo();
    }, []);

    useEffect(() => {
        const getContractDetailsByContract = async (contractId) => {
            try {
                const response = await getContractDetailsByContractWithAmount(
                    requestAuth,
                    contractId,
                );

                const status = response.status;
                if (status === 200) {
                    const data = response.data;
                    setJobsData(data);
                }
            } catch (e) {
                console.log('CONTRACT_DETAILS_ERROR');
            }
        };

        if (contract) {
            getContractDetailsByContract(contract?.contractId);
            dispatch(updateContract(contract));
        } else {
            dispatch(updateContract({}));
        }
    }, [contract, dispatch, requestAuth]);

    useEffect(() => {
        const nameJob = selectedJobs
            .map((selectedJob) => selectedJob.position.name)
            .join(', ');

        dispatch(updateNameJob(nameJob));
        dispatch(updatePositions(selectedJobs));
    }, [selectedJobs]);

    useEffect(() => {
        if (radioGroupRegister === 'all') {
            setSelectedJobs(jobsData);
            dispatch(updatePositions(jobsData));
        } else {
            setSelectedJobs([]);
            dispatch(updatePositions([]));
        }
    }, [radioGroupRegister, contract, jobsData]);

    return (
        <div className="post-page">
            <Toaster duration={3000} position="top-right" richColors />
            <h1>ĐĂNG TIN TUYỂN DỤNG</h1>
            <div className="post-container">
                <div className="post-contract">
                    <h5>Hợp đồng tuyển dụng</h5>
                    <Autocomplete
                        sx={{ m: 1 }}
                        disablePortal
                        id="combo-box-contract"
                        options={contractsData}
                        renderInput={(params) => (
                            <TextField {...params} label="Chọn hợp đồng" />
                        )}
                        onOpen={(e) => {
                            console.log('onOpen');
                            getContracts();
                        }}
                        value={contract}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                            option.contractId === value.contractId
                        }
                        onChange={handleContractChange}
                    />

                    <h5>Vị trí tuyển dụng</h5>
                    <FormControl
                        disabled={!contract}
                        sx={{
                            marginLeft: 1,
                            marginBottom: 1,
                        }}
                    >
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={radioGroupRegister}
                            onChange={handleChangeRadioRegister}
                        >
                            <FormControlLabel
                                value="single"
                                control={<Radio />}
                                label="Đăng ký từng vị trí"
                            />
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="Đăng ký cho tất cả vị trí"
                            />
                        </RadioGroup>
                        <Collapse
                            in={radioGroupRegister === 'single'}
                            timeout="auto"
                        >
                            <Autocomplete
                                disabled={!contract}
                                multiple
                                value={selectedJobs}
                                id="checkboxes-tags-demo"
                                disableCloseOnSelect
                                options={contract ? jobsData : []}
                                getOptionLabel={(option) =>
                                    option.position.name
                                }
                                onChange={handleJobsChange}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.position.name}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Vị trí tuyển dụng"
                                        placeholder="Chọn vị trí tuyển dụng"
                                    />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                    option.contractDetailsId ===
                                    value.contractDetailsId
                                }
                            />
                        </Collapse>
                    </FormControl>

                    <Collapse
                        sx={{
                            m: 1,
                        }}
                        in={selectedJobs.length > 0}
                        timeout="auto"
                    >
                        <h5>Số lượng tuyển dụng</h5>
                        <DataContractDetails />
                    </Collapse>

                    <RecruitmentTabs
                        style={{
                            width: '100%',
                            padding: '5px',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Post;
