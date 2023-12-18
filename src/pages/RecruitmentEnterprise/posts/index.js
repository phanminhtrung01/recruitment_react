/* eslint-disable react-hooks/exhaustive-deps */
import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { DataGrid, GridCellModes, GridToolbar } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import { TimeField } from '@mui/x-date-pickers';
import { GridRow } from '@mui/x-data-grid';
import { Typography, AccordionSummary } from '@mui/material';

import { Checkbox } from '@mui/material';

import {
    Input,
    Tooltip,
    styled,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Slide,
    Autocomplete,
    Collapse,
    IconButton,
    Accordion,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { randomId } from '@mui/x-data-grid-generator';
import {
    GridOverlay,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridRowModes,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridLogicOperator,
} from '@mui/x-data-grid';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    CloudUploadOutlined,
    ClearAll,
    AddBoxOutlined,
    Preview,
    Refresh,
    DeleteForever,
    WarningRounded,
    RefreshOutlined,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';

import {
    authInfoApi,
    getAmountByContractDetails,
    getTestsByPostsApi,
    postsApi,
} from '../../../api/auth';
import {
    setPosts,
    setTabFilter,
    setCurrentPost,
    resetCurrentPost,
    setCurrentPostNameJob,
    setCurrentPostDatePost,
    setCurrentPostDateExpire,
    setPostsFromEmpty,
    setPostsFilter,
    setContractsFilterMode,
    setPostsFilterMode,
    setPostsFilterValue,
    setPostsFilterData,
} from '../../../redux/postsSlice';
import useRequestAuth from '../../../hooks/useRequestAuth';
import ReactQuill from 'react-quill';

import '../../RecruitmentStudent/job/style.scss';
import { Fragment } from 'react';

import { IMaskInput } from 'react-imask';

import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import { useDebounce } from 'use-debounce';

import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { Toaster, toast } from 'sonner';
import AlertDialogModalNested from '../../../components/Dialog';
import { updateAll } from '../../../redux/infoUserSlice';

export default function PostsEnterPrise() {
    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

    const dispatch = useDispatch();
    const requestAuth = useRequestAuth();

    const today = dayjs();
    const tomorrow = today.add(1, 'day');

    const tabRef = useRef('wait-approve');
    const gridDataRef = useRef();
    const maskRef = useRef();

    const [cleared, setCleared] = useState(false);

    const ButtonStyle = styled(Button)(({ theme }) => ({
        color: theme.palette.primary,
        backgroundColor: 'transparent',
        padding: theme.spacing(0.5, 1),
        '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
    }));

    const CustomToolbarContainer = styled(GridToolbarContainer)({
        display: 'flex',
        justifyContent: 'space-between',
    });

    function CustomToolbar(props) {
        const { setRows } = props;

        const handleRefreshClick = () => {
            setRows([]);
            gridDataRef?.current.refresh();
        };

        return (
            <CustomToolbarContainer>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <GridToolbarExport
                        disabled={false}
                        csvOptions={{
                            utf8WithBom: true,
                            fileName: 'posts',
                            hideToolbar: true,
                            hideFooter: true,
                        }}
                        printOptions={{
                            utf8WithBom: true,
                            fileName: 'posts',
                            hideToolbar: true,
                            hideFooter: true,
                        }}
                    />

                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<CloudUploadOutlined />}
                    >
                        NHẬP
                        <input
                            hidden
                            onChange={(event) => {}}
                            onClick={(event) => {}}
                        />
                    </ButtonStyle>
                </div>
                <div>
                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<ClearAll />}
                        onClick={(event) => {
                            setRows([]);
                        }}
                    >
                        XÓA TẤT CẢ
                    </ButtonStyle>
                </div>

                <div>
                    <GridToolbarQuickFilter
                        disabled={false}
                        style={{ float: 'right', display: 'none' }}
                        quickFilterParser={(searchInput) =>
                            searchInput.split(',').map((value) => value.trim())
                        }
                        quickFilterFormatter={(quickFilterValues) =>
                            quickFilterValues.join(', ')
                        }
                        debounceMs={500}
                    />

                    <ButtonStyle
                        disabled={false}
                        variant="text"
                        component="label"
                        startIcon={<Refresh />}
                        onClick={handleRefreshClick}
                    >
                        Làm mới
                    </ButtonStyle>
                </div>
            </CustomToolbarContainer>
        );
    }

    function CustomNoRowsOverlay({ text }) {
        return (
            <GridOverlay>
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                    }}
                >
                    {text}
                </Box>
            </GridOverlay>
        );
    }

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

    const CrudGridPost = forwardRef((props, ref) => {
        const postsReducer = useSelector((state) => state.posts.value);

        const [open, setOpen] = useState(false);
        const [idre, setIdre] = useState();
        const apiRef = useGridApiRef();
        const followAddressRef = useRef(true);
        const renderRef = useRef();
        const gridRef = useRef();

        const { posts, currentPost, postsFilter, tabFilter } = postsReducer;

        const { mode, value, data } = postsFilter;

        const [rows, setRows] = useState(posts);
        const [rowModesModel, setRowModesModel] = useState({});
        const [editCell, setEditCell] = useState(false);
        const [viewCell, setViewCell] = useState(false);
        const [isEditCellSave, setIsEditCellSave] = useState(false);

        // apiRef.setQuickFilterValues(['Hợp đồng 5']);
        const InputNoneBoderStyle = styled(Input)({
            '&:before': {
                content: 'none',
            },
            '&:after': {
                content: 'none',
            },
            fontSize: '1.2rem',
            padding: 5,
        });

        const DatePickerNoneBoderStyle = styled(DatePicker)({
            fieldset: {
                display: 'none',
            },
        });
        const SelectNoneBoderStyle = styled(Select)({
            width: '100%',
            fieldset: {
                display: 'none',
            },
        });
        const ButtonStyle = styled(Button)({
            minWidth: 0,
        });

        const getInfo = async () => {
            const response = await authInfoApi(requestAuth);

            if (response?.status === 200) {
                dispatch(updateAll(response.data));

                return response.data;
            }
        };

        const handleConfirmRemoveClick = async (value, id) => {
            if (value === 'agree') {
                const idLoading = toast.loading('Đang xóa ...');

                try {
                    const response = await requestAuth.delete(
                        '/post-apply/delete',
                        {
                            params: {
                                postApplyId: id,
                            },
                        },
                    );
                    const data = response.data;
                    const code = data.status;

                    if (code === 200) {
                        dispatch(
                            setPostsFromEmpty(
                                rows.filter((row) => row.postApplyId !== id),
                            ),
                        );
                        dispatch(resetCurrentPost());

                        setRows((prevRows) =>
                            prevRows.filter((row) => row.postApplyId !== id),
                        );

                        toast.dismiss(idLoading);
                        toast.custom((t) =>
                            NotifierSnackbar({
                                title: 'Thành công ',
                                sub1: 'Xóa tin tuyển dụng thành công!',
                                toast: toast,
                                idToats: t,
                            }),
                        );
                    }
                } catch (e) {
                    console.error(e);
                    const responseErr = e?.response.data;
                    const code = e.code;
                    let message;
                    if (code === 'ERR_NETWORK') {
                        message = e.message;
                    } else if (
                        code === 'ERR_BAD_REQUEST' ||
                        code === 'ERR_BAD_RESPONSE'
                    ) {
                        message = responseErr.message;
                    }

                    if (message.includes('CONSTRAINT')) {
                        let parts = message.split(' CONSTRAINT ');

                        if (parts[0] === 'apply' && parts[1] === 'post_apply') {
                            message = 'Bài đăng đã được ứng tuyển';
                        }
                    }

                    toast.dismiss(idLoading);
                    toast.custom((t) =>
                        NotifierSnackbar({
                            title: 'Thất bại',
                            sub1: 'Xóa tin tuyển dụng không thất bại!',
                            sub2: message,
                            toast: toast,
                            idToats: t,
                            type: 'error',
                        }),
                    );
                }
            }
        };

        const handleWarningEditClick = async (value, id) => {
            if (value === 'agree') {
                setRowModesModel((prevRowModesModel) => {
                    return {
                        ...prevRowModesModel,
                        [id]: { mode: GridRowModes.Edit },
                    };
                });

                dispatch(
                    setCurrentPost(rows.find((row) => row.postApplyId === id)),
                );
            }
        };

        const validateDate = useCallback(
            (nameField) => {
                if (nameField) {
                    if (nameField === 'datePost') {
                        return dayjs();
                    }

                    if (nameField === 'dateExpire') {
                        const dateMin1 = currentPost?.datePost;

                        if (dateMin1) {
                            return dayjs(dateMin1, DEFAULT_DATE_FORMAT).add(
                                1,
                                'day',
                            );
                        }
                    }

                    if (nameField === 'terminationDate') {
                        const dateMin2 = currentPost?.dateExpire;
                        console.log('dateMin2', dateMin2);

                        if (dateMin2) {
                            return dayjs(dateMin2, DEFAULT_DATE_FORMAT).add(
                                1,
                                'day',
                            );
                        }
                    }
                }
            },
            [currentPost?.datePost, currentPost?.dateExpire],
        );

        const handleEditCellTextChange = useCallback((params, value) => {
            params.api.setEditCellValue({
                ...params,
                value: value,
            });
        }, []);

        const handleEditCellDateChange = useCallback((params, value) => {
            params.api.setEditCellValue({
                ...params,
                value: value,
            });

            if (params.field === 'datePost') {
                dispatch(setCurrentPostDatePost(value));
            }

            if (params.field === 'dateExpire') {
                dispatch(setCurrentPostDateExpire(value));
            }
        }, []);

        const renderEditCellDate = useMemo(
            () => (params) =>
                (
                    <DatePickerNoneBoderStyle
                        value={dayjs(params.value, DEFAULT_DATE_FORMAT)}
                        onChange={(newValue) => {
                            handleEditCellDateChange(params, newValue);
                        }}
                        textField={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                        minDate={validateDate(params.field)}
                    />
                ),
            [handleEditCellDateChange, validateDate],
        );

        const valueFormatDate = useMemo(
            () => (params) =>
                dayjs(params.value, DEFAULT_DATE_FORMAT).format(
                    DEFAULT_DATE_FORMAT,
                ),
            [],
        );

        function AddressRender(props) {
            const { getValue = (value) => {} } = props;
            const [province, setProvince] = useState(null);
            const [district, setDistrict] = useState(null);
            const [ward, setWard] = useState(null);
            const { info } = useSelector((state) => state.infoUser.value);
            const [address, setAddress] = useState(info?.address);

            const [followAddress, setFollowAddress] = useState(
                followAddressRef.current,
            );

            const handleCheckFollowAddress = () => {
                setFollowAddress(!followAddress);
            };

            function ProvinceSelectLazy({ delay }) {
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
                            width: '100%',
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

                return (
                    <Autocomplete
                        id="district-select-lazy"
                        disabled={!province}
                        sx={{
                            m: 1,
                            width: '100%',
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

                return (
                    <Autocomplete
                        id="ward-select-lazy"
                        disabled={!district}
                        sx={{
                            m: 1,
                            width: '100%',
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
                getValue(address);
            }, [address]);

            useEffect(() => {
                if (followAddress) {
                    setAddress(info?.address);
                    setProvince(null);
                }
                followAddressRef.current = followAddress;
            }, [followAddress]);

            return (
                <div>
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
                            onChange={() => handleCheckFollowAddress()}
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
                        sx={{ m: 1, width: '100%' }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
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
                                                info?.address || !followAddress
                                            }
                                            onClick={async () => {
                                                const info = await getInfo();
                                                setAddress(info.info.address);
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
            );
        }

        const columns = () => {
            const renderCell = (params) => {
                return (
                    <div
                        style={{
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                            overflow: 'auto',
                            paddingTop: 8,
                            paddingBottom: 8,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            wordWrap: 'break-word',
                        }}
                    >
                        {params.value}
                    </div>
                );
            };

            const renderCellTextFormat = (params) => {
                const { hasFocus, row, field, colDef } = params;

                const { status } = row;

                const isInViewModeCell = hasFocus;

                if (isInViewModeCell && viewCell) {
                    return (
                        <Dialog
                            open={isInViewModeCell && viewCell}
                            fullWidth
                            hideBackdrop
                            maxWidth="md"
                            keepMounted
                            disableScrollLock
                        >
                            <DialogTitle>{colDef.headerName}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Xem thông tin {colDef.headerName}
                                </DialogContentText>
                                <Box
                                    sx={{
                                        m: 1,
                                        width: '60%',
                                    }}
                                >
                                    <ReactQuill
                                        className="view-text"
                                        readOnly
                                        value={params.value}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setViewCell(false);
                                    }}
                                >
                                    Quay lại
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                }

                return (
                    <ButtonStyle
                        onClick={() => {
                            setViewCell(true);
                        }}
                        sx={{
                            width: '100%',
                        }}
                        variant={
                            status === 'Từ chối' && field === 'note'
                                ? 'contained'
                                : 'outlined'
                        }
                        color={
                            status === 'Từ chối' && field === 'note'
                                ? 'warning'
                                : 'info'
                        }
                    >
                        Xem
                    </ButtonStyle>
                );
            };

            const renderCellTextForm = (params) => {
                const { hasFocus, row, field, colDef } = params;

                const { status } = row;

                const isInViewModeCell = hasFocus;

                if (isInViewModeCell && viewCell) {
                    const { contactJobDTO, benchmarkJobDTO } = row;
                    let nestedField1 = { name: '', value: '' };
                    let nestedField2 = { name: '', value: '' };

                    if (field === 'contactJobDTO') {
                        nestedField1 = {
                            name: 'Email',
                            value: contactJobDTO?.email,
                        };
                        nestedField2 = {
                            name: 'Số điện thoại',
                            value: contactJobDTO?.phoneNumber,
                        };
                    } else {
                        nestedField1 = {
                            name: 'Điểm tối thiểu',
                            value: benchmarkJobDTO?.minMark,
                        };
                        nestedField2 = {
                            name: 'Điểm tối đa',
                            value: benchmarkJobDTO?.maxMark,
                        };
                    }

                    return (
                        <Dialog
                            open={isInViewModeCell && viewCell}
                            fullWidth
                            hideBackdrop
                            maxWidth="md"
                            keepMounted
                            disableScrollLock
                        >
                            <DialogTitle>{colDef.headerName}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Xem thông tin {colDef.headerName}
                                </DialogContentText>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        m: 1,
                                        width: '60%',
                                        gap: 3,
                                        justifyContent: 'space-evenly',
                                    }}
                                >
                                    <TextField
                                        disabled
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label={nestedField1.name}
                                        fullWidth
                                        variant="standard"
                                        value={nestedField1.value}
                                    />
                                    <TextField
                                        disabled
                                        autoFocus
                                        margin="dense"
                                        id="phone"
                                        label={nestedField2.name}
                                        variant="standard"
                                        value={nestedField2.value}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setViewCell(false);
                                    }}
                                >
                                    Quay lại
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                }

                return (
                    <ButtonStyle
                        onClick={() => {
                            setViewCell(true);
                        }}
                        sx={{
                            width: '100%',
                        }}
                        variant={
                            status === 'Từ chối' && field === 'note'
                                ? 'contained'
                                : 'outlined'
                        }
                        color={
                            status === 'Từ chối' && field === 'note'
                                ? 'warning'
                                : 'info'
                        }
                    >
                        Xem
                    </ButtonStyle>
                );
            };

            const renderEditCellTextFormat = (params) => {
                const { id, hasFocus, field, colDef } = params;

                const isInEditModeCell =
                    rowModesModel[id]?.mode === GridRowModes.Edit && hasFocus;

                if (isInEditModeCell && editCell) {
                    return (
                        <Dialog
                            fullWidth
                            hideBackdrop
                            maxWidth="md"
                            keepMounted
                            disableScrollLock
                            open={isInEditModeCell && editCell}
                        >
                            <DialogTitle>{colDef.headerName}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin {colDef.headerName}
                                </DialogContentText>
                                <Box
                                    sx={{
                                        m: 1,
                                        width: '60%',
                                    }}
                                >
                                    <ReactQuill
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === 'Tab'
                                            ) {
                                                event.stopPropagation();
                                            }
                                        }}
                                        value={params.value}
                                        onChange={(value) => {
                                            handleEditCellTextChange(
                                                params,
                                                value,
                                            );
                                        }}
                                        placeholder="Nhập mô tả công việc tuyển dụng"
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCancelCellEditClick(
                                        id,
                                        field,
                                    )}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSaveEditCellClick(id, field)}
                                >
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                }

                return (
                    <ButtonStyle
                        onClick={() => {
                            setEditCell(true);
                        }}
                    >
                        Chỉnh sửa
                    </ButtonStyle>
                );
            };

            const RenderEditCellTextFormContact = ({ params }) => {
                const { id, hasFocus, field, colDef } = params;
                const isInEditModeCell =
                    rowModesModel[id]?.mode === GridRowModes.Edit && hasFocus;

                const contact = params.row.contactJobDTO;

                const [email, setEmail] = useState(contact?.email);
                const [phone, setPhone] = useState(contact?.phoneNumber);
                const [errorEmail, setErrorEmail] = useState(false);
                const [errorPhone, setErrorPhone] = useState(false);

                const validateEmail = (email) => {
                    const emailRegex =
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    return emailRegex.test(email);
                };

                const validatePhone = () => {
                    let value = maskRef.current?.maskRef.unmaskedValue;
                    if (!maskRef.current) {
                        value = phone;
                    }
                    const phoneRegex = /^\d{10}$/;
                    return phoneRegex.test(value);
                };

                const handleEmailChange = (event) => {
                    const value = event.target.value;
                    if (validateEmail(value)) {
                        setErrorEmail(false);
                        if (!value || value.length === 0) {
                            setErrorEmail(true);
                        }
                    } else {
                        setErrorEmail(true);
                    }
                    setEmail(value);
                };

                const handlePhoneChange = (event) => {
                    const value = event.target.value;
                    if (validatePhone()) {
                        setErrorPhone(false);
                        if (!value || value.length === 0) {
                            setErrorPhone(true);
                        }
                    } else {
                        setErrorPhone(true);
                    }
                    setPhone(value);
                };

                useEffect(() => {
                    if (
                        !(
                            !email ||
                            !phone ||
                            errorPhone ||
                            phone?.length === 0 ||
                            errorEmail ||
                            email?.length === 0
                        )
                    ) {
                        const value = maskRef.current?.maskRef.unmaskedValue;

                        if (value) {
                            params.api.setEditCellValue(
                                {
                                    id: params.id,
                                    field: params.field,
                                    value: {
                                        ...contact,
                                        phoneNumber: value,
                                        email: email,
                                    },
                                },
                                params.id,
                            );
                        }
                    }
                }, [email, errorEmail, errorPhone, phone]);

                if (isInEditModeCell && editCell) {
                    return (
                        <Dialog
                            fullWidth
                            hideBackdrop
                            maxWidth="md"
                            keepMounted
                            disableScrollLock
                            open={isInEditModeCell && editCell}
                        >
                            <DialogTitle>{colDef.headerName}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Chỉnh sửa thông tin {colDef.headerName}
                                </DialogContentText>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        m: 1,
                                        width: '60%',
                                        gap: 3,
                                        justifyContent: 'space-evenly',
                                    }}
                                >
                                    <Tippy
                                        content="Email không hợp lệ"
                                        placement="auto-start"
                                        visible={
                                            errorEmail || email?.length === 0
                                        }
                                    >
                                        <TextField
                                            style={{
                                                flex: 2,
                                            }}
                                            label="Nhập email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            error={
                                                errorEmail ||
                                                email?.length === 0
                                            }
                                        />
                                    </Tippy>
                                    <Tippy
                                        content="Số điện thoại phải là 10 số"
                                        placement="auto"
                                        visible={
                                            errorPhone || phone?.length === 0
                                        }
                                    >
                                        <TextField
                                            style={{
                                                flex: 1,
                                            }}
                                            label="Nhập số điện thoại"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            InputProps={{
                                                inputComponent: TextMaskCustom,
                                            }}
                                            error={
                                                errorPhone ||
                                                phone?.length === 0
                                            }
                                        />
                                    </Tippy>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCancelCellEditClick(
                                        id,
                                        field,
                                    )}
                                    variant="outlined"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    disabled={
                                        !email ||
                                        !phone ||
                                        errorPhone ||
                                        phone?.length === 0 ||
                                        errorEmail ||
                                        email?.length === 0
                                    }
                                    onClick={handleSaveEditCellClick(id, field)}
                                    variant="contained"
                                >
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                }

                return (
                    <ButtonStyle
                        onClick={() => {
                            setEditCell(true);
                        }}
                    >
                        Chỉnh sửa
                    </ButtonStyle>
                );
            };

            const RenderEditCellTextFormInterView = ({ params }) => {
                const { id, hasFocus, field, colDef } = params;
                const isInEditModeCell =
                    rowModesModel[id]?.mode === GridRowModes.Edit && hasFocus;

                const interview = params.row.interviewInfoDTO;

                const [address, setAddress] = useState(interview?.location);
                const [time, setTime] = useState(
                    dayjs(interview?.time, 'HH:mm'),
                );
                const [type, setType] = useState(interview?.type);

                const handleTimeChange = (value, context) => {
                    console.log(value);
                    setTime(value);
                };
                const handleTypeChange = (e, value) => {
                    setType(value);
                };

                useEffect(() => {
                    params.api.setEditCellValue(
                        {
                            id: id,
                            field: field,
                            value: {
                                ...interview,
                                location: address,
                                time: dayjs(time, 'HH:mm:ss'),
                                type: type,
                            },
                        },
                        id,
                    );

                    console.log(params);
                }, [address, time, type]);

                if (isInEditModeCell && editCell) {
                    return (
                        <Dialog
                            fullWidth
                            hideBackdrop
                            maxWidth="md"
                            keepMounted
                            disableScrollLock
                            open={isInEditModeCell && editCell}
                        >
                            <DialogTitle
                                sx={{
                                    fontSize: '1.6rem',
                                    marginBottom: 2,
                                }}
                            >
                                {colDef.headerName}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText
                                    sx={{
                                        fontSize: '1.4rem',
                                        marginBottom: 2,
                                    }}
                                >
                                    Chỉnh sửa thông tin {colDef.headerName}
                                </DialogContentText>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        m: 1,
                                        gap: 3,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContain: 'center',
                                            gap: 10,
                                            width: '100%',
                                        }}
                                    >
                                        <div>
                                            <h5>Địa điểm phỏng vấn</h5>
                                            <AddressRender
                                                getValue={(value) => {
                                                    console.log(value);
                                                    setAddress(value);
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <h5>Thời gian phỏng vấn</h5>
                                            <Tippy
                                                placement="auto-start"
                                                content="Chuyển đổi ngôn ngữ nhập US (United States)"
                                            >
                                                <TimeField
                                                    sx={{ m: 1 }}
                                                    label="Nhập thời gian phỏng vấn"
                                                    onChange={handleTimeChange}
                                                    value={time}
                                                />
                                            </Tippy>
                                        </div>

                                        <div>
                                            <h5>Hình thức phỏng vấn</h5>
                                            <Autocomplete
                                                sx={{ m: 1 }}
                                                disablePortal
                                                id="combo-box-contract"
                                                options={[
                                                    'Trực tiếp',
                                                    'Meeting',
                                                    'Call',
                                                ]}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Chọn hình thức"
                                                    />
                                                )}
                                                value={type}
                                                onChange={handleTypeChange}
                                            />
                                        </div>
                                    </div>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleCancelCellEditClick(
                                        id,
                                        field,
                                    )}
                                    variant="outlined"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    disabled={!address || !time || !type}
                                    onClick={handleSaveEditCellClick(id, field)}
                                    variant="contained"
                                >
                                    Lưu
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                }

                return (
                    <ButtonStyle
                        onClick={() => {
                            setEditCell(true);
                        }}
                    >
                        Chỉnh sửa
                    </ButtonStyle>
                );
            };

            const RenderTextFormInterView = ({ params }) => {
                const { hasFocus, row, field, colDef } = params;

                const { status } = row;

                const isInViewModeCell = hasFocus;

                const interview = params.row.interviewInfoDTO;

                const [address, setAddress] = useState(interview?.location);
                const [time, setTime] = useState(
                    dayjs(interview?.time, 'HH:mm:ss').toDate(),
                );
                const [type, setType] = useState(interview?.type);

                if (isInViewModeCell && viewCell) {
                    return (
                        <Dialog
                            fullWidth
                            hideBackdrop
                            maxWidth="sm"
                            keepMounted
                            disableScrollLock
                            open={isInViewModeCell && viewCell}
                        >
                            <DialogTitle
                                sx={{
                                    fontSize: '1.7rem',
                                    marginBottom: 1,
                                    fontWeight: 'bold',
                                }}
                            >
                                {colDef.headerName}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText
                                    sx={{
                                        fontSize: '1.6rem',
                                        marginBottom: 2,
                                    }}
                                >
                                    Xem thông tin {colDef.headerName}
                                </DialogContentText>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 5,
                                        paddingLeft: 2,
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

                                    <div>
                                        <h5>Thời gian phỏng vấn</h5>
                                        <TimeField
                                            disabled
                                            sx={{ m: 1 }}
                                            label="Nhập thời gian phỏng vấn"
                                            value={time}
                                        />
                                    </div>

                                    <div>
                                        <h5>Hình thức phỏng vấn</h5>
                                        <Autocomplete
                                            disabled
                                            sx={{ m: 1 }}
                                            disablePortal
                                            id="combo-box-contract"
                                            options={[
                                                'Trực tiếp',
                                                'Meeting',
                                                'Call',
                                            ]}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Chọn hình thức"
                                                />
                                            )}
                                            value={type}
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setViewCell(false);
                                    }}
                                >
                                    Quay lại
                                </Button>
                            </DialogActions>
                        </Dialog>
                    );
                }

                return (
                    <ButtonStyle
                        onClick={() => {
                            setViewCell(true);
                        }}
                        sx={{
                            width: '100%',
                        }}
                        variant={
                            status === 'Từ chối' && field === 'note'
                                ? 'contained'
                                : 'outlined'
                        }
                        color={
                            status === 'Từ chối' && field === 'note'
                                ? 'warning'
                                : 'info'
                        }
                    >
                        Xem
                    </ButtonStyle>
                );
            };

            const RenderCellTextAmount = ({ params }) => {
                const [amount, setAmount] = useState(1);
                const [validate, setValidate] = useState({
                    error: false,
                    validate: '',
                });
                const { row, value } = params;

                useEffect(() => {
                    const getAmountRemaining = async (contractDetailsId) => {
                        try {
                            const response = await getAmountByContractDetails(
                                requestAuth,
                                contractDetailsId,
                            );

                            const status = response?.status;
                            const data = response?.data;

                            if (status === 200) {
                                setAmount(data + +value);
                            }
                        } catch (e) {
                            console.log('AMOUNT_ERROR');
                        }
                    };

                    getAmountRemaining(row.recordId);
                }, []);

                useEffect(() => {
                    setTimeout(
                        () =>
                            setValidate({
                                error: false,
                                validate: '',
                            }),
                        5000,
                    );
                }, [validate]);

                return (
                    <Tippy content={validate.validate} visible={validate.error}>
                        <TextField
                            value={params.value}
                            onChange={(event) =>
                                handleEditCellTextChange(
                                    params,
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập số lượng"
                            inputProps={{
                                min: 1,
                                step: 1,
                                max: amount,
                                pattern: '\\d+',
                                onInput: function (e) {
                                    let value = parseInt(e.target.value);
                                    if (value < 0) {
                                        value = 1;
                                        setValidate({
                                            error: true,
                                            validate: 'Số lượng lớn hơn 0',
                                        });
                                    } else {
                                        setValidate({
                                            error: false,
                                            validate: '',
                                        });
                                    }
                                    if (value > amount) {
                                        value = amount;
                                        setValidate({
                                            error: true,
                                            validate: `Số lượng vượt mức. Tối đa ${amount}`,
                                        });
                                    } else {
                                        setValidate({
                                            error: false,
                                            validate: '',
                                        });
                                    }
                                    e.target.value = value
                                        .toString()
                                        .replace(/[^0-9]/g, '');
                                },
                            }}
                        />
                    </Tippy>
                );
            };

            const RenderSubmit = forwardRef((props, ref) => {
                const { post, open } = props;
                const [openDetails, setOpenDetails] = useState(open);
                //const [post, setPost] = useState();

                const CollapsibleDataGrid = forwardRef((props, ref) => {
                    const { post } = props;
                    const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
                    const [open, setOpen] = useState({});
                    const [rows, setRows] = useState([]);
                    const [rowsSub, setRowsSub] = useState([]);

                    const valueFormatDate = useMemo(
                        () => (params) =>
                            dayjs(params.value, DEFAULT_DATE_FORMAT).format(
                                DEFAULT_DATE_FORMAT,
                            ),
                        [],
                    );

                    const renderCell = (params) => {
                        return (
                            <div
                                style={{
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    overflow: 'auto',
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {params.value}
                            </div>
                        );
                    };

                    const columns = [
                        {
                            field: 'name',
                            headerName: 'Tên bài thi',
                            flex: 2,
                            renderCell: renderCell,
                        },
                        {
                            field: 'time',
                            headerName: 'Thời gian làm bài',
                            flex: 1,
                            renderCell: renderCell,
                        },
                        {
                            field: 'expand',
                            flex: 1,
                            headerName: 'Xem chi tiết bài thi',
                            renderCell: (params) => (
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setOpen((prevOpen) => ({
                                            ...prevOpen,
                                            [params.id]: !prevOpen[params.id],
                                        }));
                                    }}
                                >
                                    {open[params.id]
                                        ? 'Thu gọn'
                                        : 'Xem chi tiết'}
                                </Button>
                            ),
                        },
                    ];

                    const columnsSub = [
                        {
                            field: 'question',
                            headerName: 'Câu hỏi',
                            flex: 1,
                            renderCell: renderCell,
                        },
                        {
                            field: 'answer',
                            headerName: 'Câu trả lời',
                            flex: 1,
                            valueFormatter: valueFormatDate,
                            renderCell: renderCell,
                        },
                        {
                            field: 'type',
                            headerName: 'Loại câu hỏi',
                            flex: 1,
                            valueFormatter: valueFormatDate,
                            renderCell: renderCell,
                        },
                        {
                            field: 'descriptions',
                            headerName: 'Mô tả câu trả lời',
                            flex: 1,
                            renderCell: renderCell,
                        },
                    ];

                    const getTests = async (postApplyId) => {
                        try {
                            const response = await getTestsByPostsApi(
                                requestAuth,
                                postApplyId,
                            );

                            const code = response.status;
                            const data = response.data;

                            if (code === 200) {
                                setRows(data?.testDTOS);
                            }
                        } catch (error) {
                            console.log('TESTS_ERROR');
                        }
                    };

                    // useImperativeHandle(ref, () => ({
                    //     getTestsData(postApplyId) {
                    //         console.log('get');
                    //         getTests(postApplyId);
                    //     },
                    // }));

                    useEffect(() => {
                        getTests(post?.postApplyId);
                    }, []);

                    return (
                        <DataGrid
                            sx={{
                                w: 1,
                                marginLeft: 1,
                                marginRight: 1,
                                marginBottom: 2,
                                height: 300,
                            }}
                            rows={rows ? rows : []}
                            columns={columns}
                            columnVisibilityModel={{
                                testId: false,
                                testDay: false,
                                isRegister: false,
                            }}
                            getRowId={(row) => row.testId}
                            hideFooter={true}
                            onRowClick={(params) => {
                                const id = params.id;
                                if (!open[id]) {
                                    const testDTO = rows.find(
                                        (ts) => ts.testId === id,
                                    );

                                    const { testDetailDTOS } = testDTO;

                                    setRowsSub(testDetailDTOS);
                                }
                            }}
                            slots={{
                                row: (params) => {
                                    return (
                                        <div>
                                            <GridRow {...params}></GridRow>
                                            <Collapse
                                                in={
                                                    params.selected &&
                                                    open[params.rowId]
                                                }
                                            >
                                                <Box
                                                    margin={2}
                                                    sx={{
                                                        width: '90%',
                                                        h: 1,
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            fontSize: '1.4rem',
                                                        }}
                                                    >
                                                        {`Chi tiết : ${params.row.name}`}
                                                    </h3>
                                                    {rowsSub.length > 0 ? (
                                                        <DataGrid
                                                            sx={{
                                                                w: 1,
                                                                m: 1,
                                                            }}
                                                            rows={rowsSub}
                                                            columns={columnsSub}
                                                            columnVisibilityModel={{
                                                                testDetailsId: false,
                                                            }}
                                                            getRowId={(row) =>
                                                                row.testDetailsId
                                                            }
                                                            hideFooter={true}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '1.2rem',
                                                                margin: 1,
                                                            }}
                                                        >
                                                            Chưa có chi tiết bài
                                                            thi
                                                        </div>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </div>
                                    );
                                },
                            }}
                        />
                    );
                });

                // useImperativeHandle(ref, () => ({
                //     open() {
                //         setOpenDetails(true);
                //     },
                //     setData(data) {
                //         setPost(data);
                //     },
                // }));

                return (
                    <Dialog
                        open={openDetails}
                        fullWidth
                        hideBackdrop
                        maxWidth="lg"
                        keepMounted
                    >
                        <DialogTitle
                            sx={{
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        >
                            Thông tin xác nhận
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Accordion
                                    sx={{
                                        mr: 1,
                                        mb: 1,
                                    }}
                                >
                                    <AccordionSummary
                                        sx={{
                                            mr: 1,
                                            m: 0,
                                        }}
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
                                            {`Thông tin bài đăng: ${
                                                post ? post.nameJob : ''
                                            }`}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            mr: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    pl: 2,
                                                    width: 200,
                                                }}
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {`Ngày đăng tin: ${post?.datePost}`}
                                            </Typography>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {`Ngày hết hạn: ${post?.dateExpire}`}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    pl: 2,
                                                    width: 200,
                                                }}
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {`Tuổi: ${post?.age}`}
                                            </Typography>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {`Giới tính: ${post?.gender}`}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {`Số lượng: ${post?.amount}`}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {`Mức lương: ${post?.salary}`}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {`Địa chỉ: ${post?.workAddress}`}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                sx={{ pl: 2 }}
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {`Trạng thái: ${post?.status}`}
                                            </Typography>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </DialogContentText>
                            <Box>
                                <Box
                                    sx={{
                                        width: '100%',
                                        mt: 1,
                                    }}
                                >
                                    <h3
                                        style={{
                                            marginTop: 5,
                                            fontSize: '1.6rem',
                                            marginBottom: 5,
                                        }}
                                    >
                                        Thông tin bài thi
                                    </h3>
                                    <CollapsibleDataGrid
                                        ref={gridRef}
                                        post={post}
                                    />
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Quay lại
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
            });

            return [
                {
                    field: 'nameJob',
                    headerName: 'Tên công việc',
                    flex: 2,
                    editable: true,
                    renderCell: renderCell,
                    renderEditCell: (params) => (
                        <TextField
                            value={params.value}
                            onChange={(event) =>
                                handleEditCellTextChange(
                                    params,
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập tên công việc"
                        />
                    ),
                },
                {
                    field: 'amount',
                    headerName: 'Số lượng',
                    flex: 1,
                    editable: true,
                    renderCell: renderCell,
                    renderEditCell: (params) => (
                        <RenderCellTextAmount params={params} />
                    ),
                },
                {
                    field: 'datePost',
                    headerName: 'Ngày đăng',
                    flex: 1,
                    type: 'date',
                    editable: true,
                    // minWidth: 100,
                    renderCell: renderCell,
                    renderEditCell: renderEditCellDate,
                    valueFormatter: valueFormatDate,
                },
                {
                    field: 'dateExpire',
                    headerName: 'Ngày hết hạn',
                    flex: 1,
                    type: 'date',
                    editable: true,
                    // minWidth: 100,
                    renderCell: renderCell,
                    renderEditCell: renderEditCellDate,
                    valueFormatter: valueFormatDate,
                },
                {
                    field: 'gender',
                    headerName: 'Giới tính',
                    flex: 1,
                    editable: true,
                    minWidth: 50,
                    type: 'singleSelect',
                    valueOptions: ['Nam', 'Nữ', 'Nam/Nữ'],
                    renderCell: renderCell,
                    renderEditCell: (params) => {
                        return (
                            <SelectNoneBoderStyle
                                value={params.value && 'Nam'}
                                onChange={(event) => {
                                    params.api.setEditCellValue({
                                        ...params,
                                        value: event.target.value,
                                    });
                                }}
                            >
                                <MenuItem key={'male'} value={'Nam'}>
                                    Nam
                                </MenuItem>
                                <MenuItem key={'female'} value={'Nữ'}>
                                    Nữ
                                </MenuItem>
                                <MenuItem key={'both'} value={'Nam/Nữ'}>
                                    Nam/Nữ
                                </MenuItem>
                            </SelectNoneBoderStyle>
                        );
                    },
                },
                {
                    field: 'age',
                    headerName: 'Tuổi',
                    flex: 1,
                    // maxWidth: 100,
                    editable: true,
                    renderCell: renderCell,
                    renderEditCell: (params) => (
                        <TextField
                            value={params.value}
                            onChange={(event) =>
                                handleEditCellTextChange(
                                    params,
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập tuổi"
                            inputProps={{
                                min: 18,
                                step: 1,
                                max: 200,
                                pattern: '\\d+',
                                onInput: function (e) {
                                    let value = parseInt(e.target.value);
                                    if (value < 0) value = 1;
                                    if (value > 200) value = 200;
                                    e.target.value = value
                                        .toString()
                                        .replace(/[^0-9]/g, '');
                                },
                            }}
                        />
                    ),
                },
                {
                    field: 'workAddress',
                    headerName: 'Địa chỉ làm việc',
                    flex: 2,
                    editable: true,
                    // minWidth: 200,
                    renderCell: renderCell,
                    renderEditCell: (params) => (
                        <TextField
                            value={params.value}
                            onChange={(event) =>
                                handleEditCellTextChange(
                                    params,
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập địa chỉ"
                        />
                    ),
                },
                {
                    field: 'salary',
                    headerName: 'Lương',
                    flex: 1,
                    editable: true,
                    renderCell: renderCell,
                    renderEditCell: (params) => (
                        <TextField
                            value={params.value}
                            onChange={(event) =>
                                handleEditCellTextChange(
                                    params,
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập mức lương"
                            inputProps={{
                                min: 1,
                                step: 1,
                                max: 1000000000,
                                pattern: '\\d+',
                                onInput: function (e) {
                                    let value = parseInt(e.target.value);
                                    if (value < 0) value = 1;
                                    if (value > 100000000) value = 100000000;
                                    e.target.value = value
                                        .toString()
                                        .replace(/[^0-9]/g, '');
                                },
                            }}
                        />
                    ),
                },
                {
                    field: 'description',
                    headerName: 'Mô tả công việc',
                    flex: 1,
                    editable: true,
                    // minWidth: 150,
                    renderCell: renderCellTextFormat,
                    renderEditCell: renderEditCellTextFormat,
                },
                {
                    field: 'required',
                    headerName: 'Yêu cầu việc làm',
                    flex: 1,
                    editable: true,
                    // minWidth: 150,
                    renderCell: renderCellTextFormat,
                    renderEditCell: renderEditCellTextFormat,
                },
                {
                    field: 'benefit',
                    headerName: 'Quyền lợi',
                    flex: 1,
                    editable: true,
                    renderCell: renderCellTextFormat,
                    renderEditCell: renderEditCellTextFormat,
                },
                {
                    field: 'contactJobDTO',
                    headerName: 'Liên hệ',
                    flex: 1,
                    editable: true,
                    renderCell: (params) =>
                        renderCellTextForm(params, 'Lien he'),
                    renderEditCell: (params) => (
                        <RenderEditCellTextFormContact params={params} />
                    ),
                },
                {
                    field: 'interviewInfoDTO',
                    headerName: 'Phỏng vấn',
                    flex: 1,
                    editable: true,
                    renderCell: (params) => (
                        <RenderTextFormInterView params={params} />
                    ),
                    renderEditCell: (params) => (
                        <RenderEditCellTextFormInterView params={params} />
                    ),
                },
                {
                    field: 'status',
                    headerName: 'Trạng thái',
                    flex: 1,
                    renderCell: renderCell,
                },
                {
                    field: 'note',
                    headerName: ' Ghi chú',
                    flex: 1,
                    renderCell: renderCellTextFormat,
                },
                {
                    field: 'actions',
                    type: 'actions',
                    headerName: 'Actions',
                    flex: 1,
                    cellClassName: 'actions',
                    getActions: (params) => {
                        const { id } = params;

                        const isInEditMode =
                            rowModesModel[id]?.mode === GridRowModes.Edit;

                        const row = rows.find((row) => row.postApplyId === id);

                        if (isInEditMode) {
                            return [
                                <Tooltip title="Lưu" key={'save'}>
                                    <GridActionsCellItem
                                        icon={<SaveIcon />}
                                        label="Save"
                                        sx={{
                                            color: 'primary.main',
                                        }}
                                        onClick={handleSaveClick(id)}
                                    />
                                </Tooltip>,
                                <Tooltip title="Hủy" key={'cancel'}>
                                    <GridActionsCellItem
                                        icon={<CancelIcon />}
                                        label="Cancel"
                                        className="textPrimary"
                                        onClick={handleCancelClick(id)}
                                        color="inherit"
                                    />
                                </Tooltip>,
                            ];
                        }

                        const actions = [
                            <Tooltip title="Xem chi tiết">
                                <div>
                                    <GridActionsCellItem
                                        icon={<Preview />}
                                        label="preview"
                                        onClick={() => {
                                            setOpen(true);
                                            setIdre(id);
                                        }}
                                        color="inherit"
                                    ></GridActionsCellItem>
                                    {idre === id && (
                                        <RenderSubmit
                                            open={open}
                                            post={rows.find(
                                                (row) => row.postApplyId === id,
                                            )}
                                        />
                                    )}
                                </div>
                            </Tooltip>,
                        ];

                        if (tabFilter !== 'signed') {
                            actions.push(
                                <Tooltip title="Xóa">
                                    <div>
                                        <AlertDialogModalNested
                                            icon={<DeleteIcon />}
                                            onButtonClick={(value) =>
                                                handleConfirmRemoveClick(
                                                    value,
                                                    id,
                                                )
                                            }
                                            subContent={
                                                <Box>
                                                    Các thông tin kèm theo sẽ bị
                                                    mất
                                                    <Box
                                                        sx={{
                                                            m: 1,
                                                        }}
                                                    >
                                                        <li>
                                                            Thông tin liên hệ
                                                        </li>
                                                        <li>
                                                            Thông tin phỏng vấn
                                                        </li>
                                                        <li>
                                                            Thông tin bài thi
                                                        </li>
                                                    </Box>
                                                </Box>
                                            }
                                            maxWidth="sm"
                                        />
                                    </div>
                                </Tooltip>,
                                <Tooltip title="Chỉnh sửa">
                                    <div>
                                        <GridActionsCellItem
                                            icon={<EditIcon />}
                                            label="edit"
                                            onClick={handleEditClick(id)}
                                            color="inherit"
                                        />
                                    </div>
                                </Tooltip>,
                            );
                        } else {
                            actions.push(
                                <Tooltip title="Chỉnh sửa">
                                    <div>
                                        <AlertDialogModalNested
                                            icon={<EditIcon />}
                                            onButtonClick={(value) =>
                                                handleWarningEditClick(
                                                    value,
                                                    id,
                                                )
                                            }
                                            status="warning"
                                            content="Bài đăng đã được xử lý sửa sẽ trở về trạng thái duyệt!"
                                        />
                                    </div>
                                </Tooltip>,
                            );
                        }

                        return [<Box>{actions}</Box>];
                    },
                },
            ];
        };

        const handleFilterByStatus = (filter) => {
            let valueFilter;

            if (filter === 'wait-approve') {
                valueFilter = 'Đang chờ duyệt';
            }

            if (filter === 'signed') {
                valueFilter = 'Đã duyệt';
            }

            if (filter === 'denied') {
                valueFilter = 'Từ chối';
            }

            apiRef.current.setFilterModel({
                items: [
                    {
                        id: 1,
                        field: 'status',
                        operator: 'contains',
                        value: valueFilter,
                    },
                ],
            });
        };

        const handleRowEditStop = (params, event) => {
            if (params.reason === GridRowEditStopReasons.rowFocusOut) {
                event.defaultMuiPrevented = true;
            }
        };

        const handleEditClick = useCallback(
            (id) => () => {
                setRowModesModel((prevRowModesModel) => {
                    return {
                        ...prevRowModesModel,
                        [id]: { mode: GridRowModes.Edit },
                    };
                });

                dispatch(
                    setCurrentPost(rows.find((row) => row.postApplyId === id)),
                );
            },
            [],
        );

        const handleSaveEditCellClick = useCallback(
            (id, field) => () => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        field: field,
                        cellToFocusAfter: 'right',
                    },
                }));

                if (editCell) {
                    setEditCell(false);
                    setTimeout(() => {
                        setRowModesModel((prevRowModesModel) => ({
                            ...prevRowModesModel,
                            [id]: { mode: GridRowModes.Edit },
                        }));
                    }, [100]);
                }

                setIsEditCellSave(true);
            },
            [editCell],
        );

        const handleSaveClick = useCallback(
            (id) => () => {
                console.log(id);
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        // field: 'benefit',
                        // cellToFocusAfter: 'right',
                    },
                }));

                if (editCell) {
                    setEditCell(false);
                }

                setIsEditCellSave(false);
            },
            [editCell],
        );

        const handleCancelClick = useCallback(
            (id) => () => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        ignoreModifications: true,
                    },
                }));

                setRows((prevRows) => {
                    const editedRow = prevRows.find(
                        (row) => row.postApplyId === id,
                    );
                    if (editedRow && editedRow.isNew) {
                        return prevRows.filter((row) => row.postApplyId !== id);
                    }
                    return prevRows;
                });

                dispatch(
                    setPostsFromEmpty(() => {
                        const editedRow = rows.find(
                            (row) => row.postApplyId === id,
                        );
                        if (editedRow && editedRow.isNew) {
                            return rows.filter((row) => row.postApplyId !== id);
                        }
                        return rows;
                    }),
                );
                dispatch(resetCurrentPost());
            },
            [],
        );

        const handleCancelCellEditClick = useCallback(
            (id, field) => () => {
                setRowModesModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: {
                        mode: GridRowModes.View,
                        ignoreModifications: true,
                        field: field,
                        cellToFocusAfter: 'right',
                    },
                }));

                setRows((prevRows) => {
                    const editedRow = prevRows.find(
                        (row) => row.postApplyId === id,
                    );
                    if (editedRow && editedRow.isNew) {
                        return prevRows.filter((row) => row.postApplyId !== id);
                    }
                    return prevRows;
                });

                dispatch(
                    setPostsFromEmpty(() => {
                        const editedRow = rows.find(
                            (row) => row.postApplyId === id,
                        );
                        if (editedRow && editedRow.isNew) {
                            return rows.filter((row) => row.postApplyId !== id);
                        }
                        return rows;
                    }),
                );
                dispatch(resetCurrentPost());

                if (editCell) {
                    setEditCell(false);
                    setTimeout(() => {
                        setRowModesModel((prevRowModesModel) => ({
                            ...prevRowModesModel,
                            [id]: { mode: GridRowModes.Edit },
                        }));
                    }, [100]);
                }
            },
            [editCell],
        );

        const processRowUpdate = async (newRow, oldRow) => {
            const updatedRow = { ...newRow, isNew: false };

            if (!isEditCellSave) {
                const idLoading = toast.loading('Đang cập nhật');

                console.log(newRow);

                try {
                    const dataRequest = {
                        ...newRow,
                        datePost: dayjs(
                            newRow.datePost,
                            DEFAULT_DATE_FORMAT,
                        ).format(DEFAULT_DATE_FORMAT),
                        dateExpire: dayjs(
                            newRow.dateExpire,
                            DEFAULT_DATE_FORMAT,
                        ).format(DEFAULT_DATE_FORMAT),
                        interviewInfoDTO: {
                            ...newRow.interviewInfoDTO,
                            time: dayjs(newRow.interviewInfoDTO.time).format(
                                'HH:mm:ss',
                            ),
                        },
                    };
                    const response = await requestAuth.put(
                        '/post-apply/update_all',
                        JSON.stringify(dataRequest),
                    );
                    const data = response.data;
                    const code = data.status;

                    if (code === 200) {
                        setRows(
                            rows.map((row) =>
                                row.postApplyId === newRow.postApplyId
                                    ? data.data
                                    : row,
                            ),
                        );
                        dispatch(
                            setPostsFromEmpty(
                                rows.map((row) =>
                                    row.postApplyId === newRow.postApplyId
                                        ? data.data
                                        : row,
                                ),
                            ),
                        );
                        dispatch(resetCurrentPost());

                        toast.dismiss(idLoading);
                        toast.custom((t) =>
                            NotifierSnackbar({
                                title: 'Thành công ',
                                sub1: 'Cập nhật tin tuyển dụng thành công!',
                                toast: toast,
                                idToats: t,
                            }),
                        );
                        return { ...data.data, isNew: false };
                    }
                } catch (e) {
                    console.error(e);
                    const responseErr = e?.response.data;
                    const code = e.code;
                    let message;
                    if (code === 'ERR_NETWORK') {
                        message = e.message;
                    } else if (
                        code === 'ERR_BAD_REQUEST' ||
                        code === 'ERR_BAD_RESPONSE'
                    ) {
                        message = responseErr.message;
                    }

                    toast.dismiss(idLoading);
                    toast.custom((t) =>
                        NotifierSnackbar({
                            title: 'Thất bại',
                            sub1: 'Cập nhật tin tuyển dụng không thành công!',
                            sub2: message,
                            toast: toast,
                            idToats: t,
                            type: 'error',
                        }),
                    );

                    return oldRow;
                }
            } else {
                setRows(
                    rows.map((row) =>
                        row.postApplyId === newRow.postApplyId
                            ? updatedRow
                            : row,
                    ),
                );

                dispatch(
                    setPostsFromEmpty(
                        rows.map((row) =>
                            row.postApplyId === newRow.postApplyId
                                ? updatedRow
                                : row,
                        ),
                    ),
                );

                dispatch(resetCurrentPost());
            }

            return updatedRow;
        };

        const handleRowModesModelChange = (newRowModesModel) => {
            setRowModesModel(newRowModesModel);
        };

        const handleCellDoubleClick = (params, event) => {
            event.defaultMuiPrevented = true;
        };

        const getPosts = async () => {
            try {
                 
                const response = await postsApi(requestAuth);

                const status = response.status;

                if (status === 200) {
                    const data = response.data;

                    dispatch(setPostsFromEmpty(data));
                    setRows(data);
                }
            } catch (e) {
                console.log('POSTS_ERROR');
            }
        };

        useImperativeHandle(ref, () => ({
            refresh() {
                getPosts();
            },
            filterByStatus(filter) {
                handleFilterByStatus(filter);
            },
        }));

        useEffect(() => {
            getPosts();
        }, []);

        useEffect(() => {
            if (mode === 'quick') {
                apiRef.current.setQuickFilterValues([value]);
            } else {
                console.log(value);

                let valueTab;
                if (tabFilter === 'wait-approve') {
                    valueTab = 'Đang chờ duyệt';
                }
                if (tabFilter === 'signed') {
                    valueTab = 'Đã duyệt';
                }
                if (tabFilter === 'denied') {
                    valueTab = 'Từ Chối';
                }

                let nameField;
                if (data[0] === 'start') {
                    nameField = 'datePost';
                } else {
                    nameField = 'dateExpire';
                }
                console.log(nameField);

                apiRef.current.setFilterModel({
                    items: [
                        {
                            id: 1,
                            field: nameField,
                            operator: 'after',
                            value: value.startDate?.toISOString(),
                        },
                    ],
                });

                let filteredContracts = rows.filter((row) => {
                    let datePar = new Date(row[nameField]);
                    let dateE = new Date(value.endDate);
                    return row.status === valueTab && datePar < dateE;
                });
                setRows(filteredContracts);
            }
        }, [data, mode, value]);

        return (
            <DataGrid
                apiRef={apiRef}
                {...props}
                autoHeight
                getRowHeight={() => 'auto'}
                rows={rows}
                getRowId={(row) => row.postApplyId}
                columns={columns()}
                editMode="cell"
                onCellDoubleClick={handleCellDoubleClick}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                pageSize={rows.length}
                hideFooter={true}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                columnVisibilityModel={{
                    postApplyId: false,
                }}
                slots={{
                    toolbar: CustomToolbar,
                    noRowsOverlay: () => (
                        <CustomNoRowsOverlay text="Không có tin đăng tuyển dụng!" />
                    ),
                    noResultsOverlay: () => (
                        <CustomNoRowsOverlay text="Không tìm thấy tin tuyển dụng" />
                    ),
                    //pagination: CustomPagination,
                }}
                slotProps={{
                    toolbar: {
                        setRows,
                    },
                }}
                initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterLogicOperator: GridLogicOperator.Or,
                        },
                    },
                }}
            />
        );
    });

    function ManagerPosts() {
        const tabFilter = useSelector(
            (state) => state.contracts.value.tabFilter,
        );
        const [valueTabFilter, setValueTabFilter] = useState(tabFilter);

        const handleChangeTabFilterStatus = (event, newValue) => {
            console.log(newValue);
            setValueTabFilter(newValue);
            // tabRef.current = newValue;
            dispatch(setTabFilter(newValue));
        };

        useEffect(() => {
            if (valueTabFilter) {
                if (valueTabFilter === 'wait-approve') {
                    gridDataRef.current.filterByStatus('wait-approve');
                }
                if (valueTabFilter === 'signed') {
                    gridDataRef.current.filterByStatus('signed');
                }
                if (valueTabFilter === 'denied') {
                    gridDataRef.current.filterByStatus('denied');
                }
            }
        }, [valueTabFilter]);

        return (
            <>
                <div ref={tabRef}>
                    <TabContext value={valueTabFilter}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList
                                onChange={handleChangeTabFilterStatus}
                                aria-label="lab API tabs example"
                            >
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Bài đăng đang duyệt"
                                    value="wait-approve"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Bài đăng đã duyệt"
                                    value="signed"
                                />
                                <Tab
                                    style={{
                                        fontSize: '1.2rem',
                                        textTransform: 'none',
                                    }}
                                    label="Bài đăng từ chối"
                                    value="denied"
                                />
                            </TabList>
                        </Box>
                    </TabContext>
                </div>
                <Box sx={{ height: 400, width: 1 }}>
                    <CrudGridPost ref={gridDataRef} />
                </Box>
            </>
        );
    }

    function SearchPosts() {
        const [filterDate, setFilterDate] = useState('');
        const [searchInput, setSearch] = useState('');
        const [startDate, setStartDate] = useState();
        const [endDate, setEndDate] = useState();

        const handleChangeFilterDate = (event) => {
            setFilterDate(event.target.value);
            dispatch(setPostsFilterData([event.target.value]));
        };

        const handleSearchChange = (event) => {
            setSearch(event.target.value);
            dispatch(
                setPostsFilter({
                    mode: 'quick',
                    value: event.target.value,
                    data: [],
                }),
            );
        };

        const handleStartDateChange = (newValue) => {
            setStartDate(newValue);
        };
        const handleEndDateChange = (newValue) => {
            setEndDate(newValue);
        };

        useEffect(() => {
            if (endDate) {
                dispatch(
                    setPostsFilter({
                        mode: 'time',
                        value: {
                            startDate: startDate
                                ? new Date(startDate)
                                : new Date(dayjs()),
                            endDate: new Date(endDate),
                        },
                        data: [],
                    }),
                );
            }
        }, [endDate, startDate]);

        return (
            <div
                ref={tabRef}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    rowGap: 10,
                    columnGap: 30,
                    // width: '100%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        flex: 2,
                        gap: 30,
                    }}
                >
                    <div
                        style={{
                            flex: 2,
                        }}
                    >
                        <h5>Từ khóa</h5>
                        <TextField
                            id="standard-basic"
                            sx={{ m: 2, width: 1 }}
                            label="Nhập từ khóa"
                            type="text"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <h5>Tìm theo ngày</h5>
                        <FormControl sx={{ m: 2, width: 1 }}>
                            <InputLabel id="demo-simple-select-label">
                                Loại
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterDate}
                                label="Age"
                                onChange={handleChangeFilterDate}
                            >
                                <MenuItem value={'start'}>
                                    Ngày hiệu lực
                                </MenuItem>
                                <MenuItem value={'end'}>Ngày chấm dứt</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div
                        style={{
                            flex: 2,
                        }}
                    >
                        <h5>Chọn ngày</h5>
                        <DatePicker
                            sx={{ m: 1, width: 1 }}
                            label="Từ Ngày"
                            inputFormat="dd/MM/yyyy"
                            value={dayjs(startDate)}
                            onChange={handleStartDateChange}
                            slotProps={{
                                field: {
                                    clearable: true,
                                    onClear: () => setCleared(true),
                                },
                            }}
                        />
                        <DatePicker
                            sx={{ m: 1, width: 1 }}
                            label="Đến Ngày"
                            inputFormat="dd/MM/yyyy"
                            value={dayjs(endDate)}
                            onChange={handleEndDateChange}
                            slotProps={{
                                field: {
                                    clearable: true,
                                    onClear: () => setCleared(true),
                                },
                            }}
                            minDate={dayjs(startDate).add(1, 'day')}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                    }}
                ></div>
            </div>
        );
    }

    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => {};
    }, [cleared]);

    return (
        <div
            style={{
                paddingLeft: 20,
                paddingRight: 20,
            }}
        >
            <Toaster duration={3000} position="top-right" theme="light" />
            <div>
                <h2
                    style={{
                        marginBottom: 10,
                    }}
                >
                    BÀI ĐĂNG
                </h2>

                <SearchPosts />
            </div>

            <ManagerPosts />
        </div>
    );
}
