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

import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

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
} from '@mui/material';
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
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';

import { getAmountByContractDetails, postsApi } from '../../../api/auth';
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

import NotifierSnackbar from '../../../components/Notification/notifier-error';
import { Toaster, toast } from 'sonner';

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
        const { setRows, setRowModesModel } = props;

        const currentRow = useSelector(
            (state) => state.posts.value.currentPost,
        );

        const handleAddClick = () => {
            const postApplyId = randomId();

            setRows((oldRows) => [
                ...oldRows,
                { ...currentRow, postApplyId, isNew: true },
            ]);

            setRowModesModel((oldModel) => ({
                ...oldModel,
                [postApplyId]: {
                    mode: GridRowModes.Edit,
                    fieldToFocus: 'nameJob',
                },
            }));
        };

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
                        startIcon={<AddBoxOutlined />}
                        onClick={handleAddClick}
                    >
                        THÊM BÀI ĐĂNG
                    </ButtonStyle>
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

        const apiRef = useGridApiRef();

        const { posts, currentPost, postsFilter, tabFilter } = postsReducer;

        const { mode, value, data } = postsFilter;

        const [rows, setRows] = useState(posts);
        const [rowModesModel, setRowModesModel] = useState({});
        const [editCell, setEditCell] = useState(false);
        const [viewCell, setViewCell] = useState(false);
        const [isEditCellSave, setIsEditCellSave] = useState(false);

        const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
        const [openWarningEditStatus, setOpenWarningEditStatus] =
            useState(false);

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

        const Transition = forwardRef(function Transition(props, ref) {
            return <Slide direction="up" ref={ref} {...props} />;
        });

        function AlertDialogModal(props) {
            const {
                openDialog,
                onButtonClick,
                status = 'error',
                content = 'Bạn đã chắc chắn xóa',
            } = props;
            const [open, setOpen] = openDialog;

            let color, message;
            if (status === 'error') {
                color = 'red';
                message = 'Xóa';
            }
            if (status === 'warning') {
                color = 'yellow';
                message = 'Đồng ý';
            }

            return (
                <Dialog
                    TransitionComponent={Transition}
                    fullWidth
                    hideBackdrop
                    maxWidth="xs"
                    keepMounted
                    disableScrollLock
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <DialogTitle
                        color={color}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <WarningRounded
                            sx={{
                                fontSize: 20,
                            }}
                        />
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}
                        >
                            Xác nhận
                        </div>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>{content}</DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color={status}
                            onClick={() => {
                                onButtonClick('agree');
                                setOpen(false);
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                {message}
                            </div>
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                onButtonClick('cancel');
                                setOpen(false);
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                Hủy
                            </div>
                        </Button>
                    </DialogActions>
                </Dialog>
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

            const RenderEditCellTextFormBenchmark = ({ params }) => {
                const { id, hasFocus, field, colDef } = params;
                const isInEditModeCell =
                    rowModesModel[id]?.mode === GridRowModes.Edit && hasFocus;

                const benchmark = params.row.benchmarkJobDTO;
                console.log(benchmark);
                const [minMark, setMinMark] = useState(benchmark?.minMark);
                const [maxMark, setMaxMark] = useState(benchmark?.maxMark);
                const [errorMax, setErrorMax] = useState(false);
                const [validate, setValidate] = useState({
                    validate: '',
                    error: false,
                });

                const handleMinMarkChange = (event) => {
                    setMinMark(event.target.value);
                };

                const handleMaxMarkChange = (event) => {
                    setMaxMark(event.target.value);
                };

                useEffect(() => {
                    if (minMark > maxMark) {
                        setMaxMark(+minMark + 1);
                    }
                }, [minMark]);

                useEffect(() => {
                    if (+maxMark < +minMark) {
                        setErrorMax(true);
                    } else {
                        setErrorMax(false);
                    }
                }, [maxMark]);

                useEffect(() => {
                    if (validate.error) {
                        setTimeout(() => {
                            setValidate({
                                error: false,
                                validate: '',
                            });
                        }, 5000);
                    }
                }, [validate]);

                useEffect(() => {
                    if (
                        !(
                            !minMark ||
                            !maxMark ||
                            minMark === 0 ||
                            maxMark === 0 ||
                            errorMax
                        )
                    ) {
                        params.api.setEditCellValue(
                            {
                                id: id,
                                field: field,
                                value: {
                                    ...benchmark,
                                    minMark: +minMark,
                                    maxMark: +maxMark,
                                },
                            },
                            id,
                        );
                    }
                }, [minMark, maxMark, errorMax]);

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
                                        content="Điểm không hợp lệ"
                                        placement="auto-end"
                                        visible={!minMark || +minMark === 0}
                                    >
                                        <TextField
                                            style={{
                                                flex: 2,
                                            }}
                                            label="Nhập điểm nhỏ"
                                            value={minMark}
                                            onChange={handleMinMarkChange}
                                            error={!minMark || +minMark === 0}
                                        />
                                    </Tippy>
                                    <Tippy
                                        content={
                                            validate.error
                                                ? errorMax
                                                    ? 'Điểm cần lớn hơn điểm nhỏ và nhỏ hơn 10'
                                                    : 'Điểm phải nhỏ hơn 10'
                                                : errorMax
                                                ? 'Điểm cần lớn hơn điểm nhỏ'
                                                : null
                                        }
                                        placement="auto-end"
                                        visible={
                                            +maxMark < +minMark ||
                                            errorMax ||
                                            validate.error
                                        }
                                    >
                                        <TextField
                                            style={{
                                                flex: 1,
                                            }}
                                            label="Nhập điểm lớn"
                                            value={maxMark}
                                            onChange={handleMaxMarkChange}
                                            error={
                                                !maxMark ||
                                                validate.error ||
                                                errorMax
                                            }
                                            inputProps={{
                                                min: 1,
                                                step: 1,
                                                max: 10,
                                                pattern: '\\d+',
                                                onInput: function (e) {
                                                    let value = parseInt(
                                                        e.target.value,
                                                    );
                                                    if (value < 0) {
                                                        value = 1;
                                                        setValidate({
                                                            error: true,
                                                            validate:
                                                                'Số lượng lớn hơn 0',
                                                        });
                                                    } else {
                                                        setValidate({
                                                            error: false,
                                                            validate: '',
                                                        });
                                                    }
                                                    if (value > 10) {
                                                        value = 10;
                                                        setValidate({
                                                            error: true,
                                                            validate: `Số lượng vượt mức. Tối đa 10`,
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
                                        !minMark ||
                                        !maxMark ||
                                        minMark === 0 ||
                                        maxMark === 0 ||
                                        errorMax
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
                    field: 'benchmarkJobDTO',
                    headerName: 'Tiêu chí',
                    flex: 1,
                    editable: true,
                    renderCell: renderCellTextForm,
                    renderEditCell: (params) => (
                        <RenderEditCellTextFormBenchmark params={params} />
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
                    getActions: ({ id }) => {
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
                            // TODO: HANDLE POST_APPLY_MERGE
                            // HANDLE MERGE: OVERIGHT OR MEARGE OR BOTH

                            <Tooltip title="Xem chi tiết" key={'details'}>
                                <GridActionsCellItem
                                    icon={<Preview />}
                                    label="preview"
                                    // onClick={handleDeleteClick(id)}
                                    color="inherit"
                                />
                            </Tooltip>,
                            <Tooltip title="Xóa" key={'delete'}>
                                <GridActionsCellItem
                                    icon={<DeleteIcon />}
                                    label="delete"
                                    onClick={() => setOpenConfirmDelete(true)}
                                    color="inherit"
                                />
                                <AlertDialogModal
                                    openDialog={[
                                        openConfirmDelete,
                                        setOpenConfirmDelete,
                                    ]}
                                    onButtonClick={(value) =>
                                        handleConfirmRemoveClick(value, id)
                                    }
                                />
                            </Tooltip>,
                            <Tooltip title="Chỉnh sửa" key={'edit1'}>
                                <GridActionsCellItem
                                    icon={<EditIcon />}
                                    label="edit"
                                    onClick={
                                        row.status !== 'Đã duyệt'
                                            ? handleEditClick(id)
                                            : () => {
                                                  setOpenWarningEditStatus(
                                                      true,
                                                  );
                                              }
                                    }
                                    color="inherit"
                                />
                                <AlertDialogModal
                                    openDialog={[
                                        openWarningEditStatus,
                                        setOpenWarningEditStatus,
                                    ]}
                                    onButtonClick={(value) =>
                                        handleWarningEditClick(value, id)
                                    }
                                    status="warning"
                                    content="Bài đăng đã được xử lý sửa sẽ trở về trạng thái duyệt!"
                                />
                            </Tooltip>,
                        ];

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

                try {
                    const response = await requestAuth.put(
                        '/post-apply/update_all',
                        JSON.stringify(newRow),
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
                    console.log(data);
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
            if (!rows[rows.length - 1]?.isNew) {
                console.log('row lasted old', rows[rows.length - 1]);
            }
        }, [rows]);

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
                    valueTab = 'Đang chờ';
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
                        setRowModesModel,
                    },
                }}
                initialState={{
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    id: 1,
                                    field: 'name',
                                    operator: 'contains',
                                    value: 'DG',
                                },
                            ],
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
